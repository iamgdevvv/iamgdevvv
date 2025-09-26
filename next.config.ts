import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	reactStrictMode: true,
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		formats: ['image/avif'],
		qualities: [90],
		dangerouslyAllowSVG: true,
		minimumCacheTTL: 60 * 60 * 24 * 30,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*',
			},
		],
	},
	experimental: {
		useCache: true,
		reactCompiler: false,
		optimizeCss: true,
		optimizeServerReact: true,
		optimizePackageImports: [
			'@mantine/core',
			'@mantine/hooks',
			'@mantine/form',
			'@mantine/carousel',
			'@mantine/nprogress',
		],
	},
	async headers() {
		return [
			{
				source: '/_next/image/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
		]
	},
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
