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
        remotePatterns: [
            {protocol: "https", hostname: "flowbite.s3.amazonaws.com"},
            {protocol: "https", hostname: "placehold.co"},
        ],
    },
})

export default config
