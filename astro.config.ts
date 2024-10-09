import { defineConfig, passthroughImageService } from 'astro/config'
import mdx from '@astrojs/mdx'
import UnoCSS from '@unocss/astro'
import sitemap from '@astrojs/sitemap'
import remarkUnwrapImages from 'remark-unwrap-images'
import rehypeExternalLinks from 'rehype-external-links'
import expressiveCode from 'astro-expressive-code'
import icon from 'astro-icon'
import { expressiveCodeOptions, siteConfig } from './src/configs/site.ts'

import vercel from '@astrojs/vercel/serverless'

import webmanifest from 'astro-webmanifest'

// https://astro.build/config
export default defineConfig({
	site: 'https://iamgdev.my.id',
	image: {
		service: passthroughImageService()
	},
	integrations: [
		expressiveCode(expressiveCodeOptions),
		UnoCSS({ injectReset: true }),
		sitemap({
			changefreq: 'daily',
			priority: 0.7,
		}),
		mdx(),
		icon({
			iconDir: 'src/libs/icons'
		}),
		webmanifest({
			icon: 'src/assets/iamgdev.png',
			name: 'Iamgdev Portfolio',
			short_name: 'iamgdev',
			description: siteConfig.description,
			lang: siteConfig.lang,
			start_url: '/',
			theme_color: '#fed7aa',
			background_color: '#fff',
			display: 'standalone',
			locales: {
				id: {
					name: 'Portfolio Iamgdev',
					short_name: 'iamgdev',
					description:
						'Membangun situs web responsive dan memprioritaskan kinerja dan REST API yang andal untuk membuat tim Front-End senang',
					lang: 'id-ID',
					start_url: '/id'
				}
			}
		})
	],
	markdown: {
		remarkPlugins: [remarkUnwrapImages],
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					target: '_blank',
					rel: ['nofollow, noopener, noreferrer']
				}
			]
		],
		remarkRehype: {
			footnoteLabelProperties: {
				className: ['']
			}
		}
	},
	prefetch: {
		defaultStrategy: 'viewport'
	},
	output: 'hybrid',
	adapter: vercel({
		isr: {
			expiration: 60 * 5
		},
		edgeMiddleware: true,
		webAnalytics: { enabled: true },
		imageService: true,
		imagesConfig: {
			domains: ['iamgdev.my.id'],
			sizes: [320, 640, 1280]
		}
	})
})
