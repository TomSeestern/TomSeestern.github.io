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
    images: {
        remotePatterns: [
            {protocol: "https", hostname: "flowbite.s3.amazonaws.com"},
            {protocol: "https", hostname: "placehold.co"},
        ],
    },
})

export default config
