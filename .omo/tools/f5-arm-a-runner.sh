#!/usr/bin/env bash
# ============================================================================
# F5 Arm A runner — capture a VALID /projects Lighthouse reading
# ============================================================================
# WHY THIS EXISTS
#   Plan Success-Criterion #3 needs ONE /projects LHR with
#   environment.benchmarkIndex >= 2510, because the T02 baseline was captured
#   at bi 2511-3064 with Lighthouse 13.4.1 + nix Chromium 149.0.7827.200.
#   Readings taken below that are VOID (incomparable) and must not be judged.
#
#   Six manual attempts + run 6 all landed at bi 598-2416: the host is shared
#   with an external Stryker job and, in-session, with this agent harness
#   (.opencode-wrapp + ~40 lsp/codegraph node workers). The window is rare and
#   unpredictable, so babysitting `uptime` wastes human time.
#
# THIS SCRIPT
#   Waits (cheaply, ~0 CPU) until the host is genuinely quiet, then runs exactly
#   ONE Arm A reading, validates it by benchmarkIndex, and keeps it ONLY if
#   valid. Bounded, self-terminating, kills its own server, never touches
#   product files.
#
# USAGE
#   bash .omo/tools/f5-arm-a-runner.sh
#   MAX_ITERS=150 SLEEP=600 MIN_BI=2510 bash .omo/tools/f5-arm-a-runner.sh
#   setsid nohup bash .omo/tools/f5-arm-a-runner.sh >/dev/null 2>&1 &   # detach
#
# STOP
#   pkill -f f5-arm-a-runner.sh
#
# OUTPUT (all under .omo/evidence/f5-lighthouse/)
#   armA-valid-projects.json     the kept reading (only if bi >= MIN_BI)
#   f5-arm-a-verdict.txt         human-readable PASS/FAIL for the LCP budget
#   f5-runner-<stamp>.log        timestamped iteration log
#   f5-runner-server-<stamp>.log server output
# ============================================================================
set -uo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$REPO/.omo/evidence/f5-lighthouse"
LH="$HOME/.npm/_npx/0f94ee7615faf582/node_modules/lighthouse/cli/index.js"
CHROME="${CHROME_PATH_OVERRIDE:-/etc/profiles/per-user/tom/bin/chromium}"
PORT="${PORT:-3000}"
MIN_BI="${MIN_BI:-2510}"
MAX_ITERS="${MAX_ITERS:-150}"     # 150 x 10 min = 25 h ceiling
SLEEP="${SLEEP:-600}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
LOG="$OUT/f5-runner-$STAMP.log"
CAND="$OUT/.armA-candidate.json"
VALID="$OUT/armA-valid-projects.json"
VERDICT="$OUT/f5-arm-a-verdict.txt"
URL="http://127.0.0.1:$PORT/projects"
SERVER_PID=""

mkdir -p "$OUT"
log() { printf '[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" | tee -a "$LOG" >&2; }
die() { log "FATAL: $*"; exit 1; }

# ---- preflight -------------------------------------------------------------
[ -f "$LH" ]     || die "cached Lighthouse not found at $LH"
[ -x "$CHROME" ] || die "Chromium not found at $CHROME"
[ -f "$REPO/.next/BUILD_ID" ] || die ".next/BUILD_ID missing — run: nix develop -c pnpm build"
if [ -n "$(find "$REPO/app" "$REPO/components" "$REPO/lib" "$REPO/next.config.mjs" \
        -newer "$REPO/.next/BUILD_ID" -print -quit 2>/dev/null)" ]; then
  die "product files are newer than .next — rebuild first: nix develop -c pnpm build"
fi
log "chromium: $("$CHROME" --version 2>/dev/null)"
log "LH: $(node "$LH" --version 2>/dev/null)  min_bi=$MIN_BI max_iters=$MAX_ITERS sleep=${SLEEP}s"
log "HEAD: $(cd "$REPO" && git rev-parse HEAD)"
log "repo: $REPO"

# ---- host-quiet gate (cheap; ~0 CPU while waiting) -------------------------
# Deliberately permissive pre-filter: the definitive validity test is the
# reading's own benchmarkIndex (below), which self-discards void runs. External
# heavy load suppresses bi; the harness itself is ~1 core, so REQUIRE_NO_AGENT=1
# is opt-in for a fully detached measurement.
LOAD_MAX="${LOAD_MAX:-6}"          # 1-min loadavg ceiling
blockers() {
  if [ "${BYPASS_GATE:-0}" = "1" ]; then printf ''; return 0; fi
  local b=""
  pgrep -f 'stryker.js run' >/dev/null 2>&1 && b="$b stryker"
  pgrep -f '[c]c1plus'      >/dev/null 2>&1 && b="$b compiler"
  pgrep -f '[c]c1 '         >/dev/null 2>&1 && b="$b cc1"
  if [ "${REQUIRE_NO_AGENT:-0}" = "1" ]; then
    pgrep -f '.opencode-wrapp' >/dev/null 2>&1 && b="$b agent-session"
  fi
  awk -v max="$LOAD_MAX" '{ if ($1+0 >= max) exit 0; else exit 1 }' /proc/loadavg \
    && b="$b loadavg>=$LOAD_MAX"
  printf '%s' "$b"
}
port_busy() { ss -ltn 2>/dev/null | grep -q ":$PORT "; }

# ---- server management -----------------------------------------------------
server_pids_on_port() {
  ss -ltnp 2>/dev/null | grep ":$PORT " | grep -oE 'pid=[0-9]+' | cut -d= -f2 | sort -u
}
start_server() {
  log "starting production server on :$PORT"
  ( cd "$REPO" && nix develop -c bash -c '
      unset PNPM_HOME npm_config_prefix
      export PORT='"$PORT"'
      export SSL_CERT_FILE=/etc/ssl/certs/ca-bundle.crt NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-bundle.crt
      exec pnpm start
    ' >>"$OUT/f5-runner-server-$STAMP.log" 2>&1 ) &
  SERVER_PID=$!
  local deadline=$(( SECONDS + 120 ))
  while [ "$SECONDS" -lt "$deadline" ]; do
    if curl -sf -o /dev/null "$URL"; then log "server ready after $((120 - (deadline - SECONDS)))s"; return 0; fi
    sleep 2
  done
  log "server did not answer within 120s"
  return 1
}
stop_server() {
  for p in $(server_pids_on_port); do kill "$p" 2>/dev/null; done
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null
  sleep 2
  for p in $(server_pids_on_port); do kill -9 "$p" 2>/dev/null; done
  SERVER_PID=""
}
trap 'stop_server' EXIT INT TERM

# ---- main loop -------------------------------------------------------------
for i in $(seq 1 "$MAX_ITERS"); do
  bl="$(blockers)"
  if [ -n "$bl" ]; then
    log "iter $i/$MAX_ITERS — host busy:$bl — sleeping ${SLEEP}s"
    sleep "$SLEEP"; continue
  fi
  if port_busy; then
    log "iter $i/$MAX_ITERS — :$PORT already in use — sleeping ${SLEEP}s"
    sleep "$SLEEP"; continue
  fi

  log "iter $i/$MAX_ITERS — host quiet; measuring"
  if ! start_server; then
    log "iter $i: server failed to start"
    stop_server; sleep "$SLEEP"; continue
  fi

  nix develop -c bash -c '
    unset PNPM_HOME npm_config_prefix
    export CHROME_PATH='"$CHROME"'
    node '"$LH"' "'"$URL"'" \
      --output=json --output-path='"$CAND"' \
      --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage" \
      --only-categories=performance,accessibility,best-practices,seo \
      --quiet --throttling-method=simulate
  ' >>"$LOG" 2>&1
  stop_server

  if [ ! -f "$CAND" ]; then
    log "iter $i: no LHR produced"; sleep "$SLEEP"; continue
  fi

  REPO="$REPO" CAND="$CAND" node -e '
    const j = require(process.env.CAND);
    const g = a => j.audits[a] ? j.audits[a].numericValue : NaN;
    console.log([
      Math.round(j.environment.benchmarkIndex),
      Math.round(g("largest-contentful-paint")),
      g("cumulative-layout-shift").toFixed(3),
      Math.round(g("total-blocking-time")),
      j.lighthouseVersion
    ].join(" "));
  ' > "$OUT/.armA-metrics.txt" 2>/dev/null
  read -r BI LCP CLS TBT LHV < "$OUT/.armA-metrics.txt" 2>/dev/null || true

  if [ -z "${BI:-}" ]; then
    log "iter $i: could not parse metrics"; rm -f "$CAND"; sleep "$SLEEP"; continue
  fi
  log "iter $i: bi=$BI lcp=$LCP cls=$CLS tbt=$TBT (LH $LHV)"

  if [ "$BI" -ge "$MIN_BI" ]; then
    mv "$CAND" "$VALID"
    if [ "$LCP" -lt 2500 ]; then V="PASS — LCP ${LCP} ms < 2500 (budget met)"; else V="FAIL — LCP ${LCP} ms >= 2500 (T30 is real)"; fi
    {
      echo "F5 Arm A — VALID reading"
      echo "timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
      echo "HEAD: $(cd "$REPO" && git rev-parse HEAD)"
      echo "lighthouse: $LHV   chromium: $("$CHROME" --version 2>/dev/null)"
      echo "benchmarkIndex: $BI  (>= $MIN_BI → comparable to T02 baseline 2511-3064)"
      echo "LCP: ${LCP} ms   CLS: ${CLS}   TBT: ${TBT} ms"
      echo "RESULT: $V"
      echo "artifact: $VALID"
    } > "$VERDICT"
    log "VALID READING → $V"
    log "verdict written: $VERDICT"
    exit 0
  fi

  log "iter $i: bi=$BI < $MIN_BI → VOID, discarded"
  rm -f "$CAND"
  sleep "$SLEEP"
done

log "exhausted $MAX_ITERS iterations without a valid (bi>=$MIN_BI) reading"
echo "NO VALID READING after $MAX_ITERS iterations — see $LOG" > "$VERDICT"
exit 2
