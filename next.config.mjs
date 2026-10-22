import withBundleAnalyzer from "@next/bundle-analyzer"
import withPlugins from "next-compose-plugins"
import {env} from "./env.mjs"

/**
 * @type {import('next').NextConfig}
 */
const config = withPlugins([[withBundleAnalyzer({enabled: env.ANALYZE})]], {
    reactStrictMode: true,
    // The dev indicator is useful while coding but leaks into the README
    // screenshot workflow, which boots a dev server to capture showcase art.
    devIndicators: false,
    rewrites() {
        return [
            {source: "/healthz", destination: "/api/health"},
            {source: "/api/healthz", destination: "/api/health"},
            {source: "/health", destination: "/api/health"},
            {source: "/ping", destination: "/api/health"},
        ]
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "Content-Security-Policy-Report-Only", value: "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; form-action 'self'" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-Frame-Options", value: "DENY" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                ],
            },
        ];
    },
    images: {
        // Negotiate AVIF first, then WebP; the optimizer falls back to the
        // source format for clients that advertise neither.
        formats: ["image/avif", "image/webp"],
        // Explicit width ladder for `sizes`-driven srcset generation. Pinning it
        // (instead of inheriting Next's default) keeps generated URLs stable
        // across framework upgrades and drops the unused 3840px tier.
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        // Optimized derivatives are content-addressed and never change, so cache
        // them at the edge for 31 days instead of Next's 60s default.
        minimumCacheTTL: 2678400,
        // Every content image is self-hosted under public/img. Keeping the
        // remote allowlist empty preserves the CSP img-src 'self' posture.
        remotePatterns: [],
    },
})

export default config
