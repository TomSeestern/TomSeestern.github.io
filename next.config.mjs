import withBundleAnalyzer from "@next/bundle-analyzer"
import withPlugins from "next-compose-plugins"
import {env} from "./env.mjs"

/**
 * @type {import('next').NextConfig}
 */
const config = withPlugins([[withBundleAnalyzer({enabled: env.ANALYZE})]], {
    reactStrictMode: true,
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
        // The corpus's only remote image (the cheesecake recipe photo) is
        // self-hosted at public/img/cheesecake-ebeltoft.webp, so no
        // plantoeat.s3.amazonaws.com pattern is needed: react-markdown emits a
        // plain <img> that next/image never optimizes, and self-hosting keeps
        // the CSP img-src 'self' policy un-widened. The entries below exist for
        // Storybook/Flowbite placeholder assets only.
        remotePatterns: [
            {protocol: "https", hostname: "flowbite.s3.amazonaws.com"},
            {protocol: "https", hostname: "placehold.co"},
        ],
    },
})

export default config
