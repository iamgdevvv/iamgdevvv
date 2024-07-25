import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import node from '@astrojs/node'
import remarkUnwrapImages from 'remark-unwrap-images'
import rehypeExternalLinks from 'rehype-external-links'
import expressiveCode from 'astro-expressive-code'
import icon from 'astro-icon'
import { expressiveCodeOptions } from './src/configs/site.ts'
import { remarkReadingTime } from './src/utils/remarkReadingTime.ts'

// import vercel from '@astrojs/vercel/serverless'

// https://astro.build/config
export default defineConfig({
	site: 'https://iamgdev.my.id',
	integrations: [
		expressiveCode(expressiveCodeOptions),
		tailwind({
			applyBaseStyles: false
		}),
		sitemap(),
		mdx(),
		icon({
			iconDir: 'src/libs/icons'
		})
	],
	markdown: {
		remarkPlugins: [remarkUnwrapImages, remarkReadingTime],
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
	adapter: node({
		mode: 'standalone'
	})
	// adapter: vercel({
	// 	isr: {
	// 		expiration: 60 * 5
	// 	},
	// 	edgeMiddleware: true,
	// 	webAnalytics: { enabled: true },
	// 	imageService: true,
	// 	imagesConfig: {
	// 		domains: ['www.iamgdev.my.id'],
	// 		sizes: [320, 640, 1280]
	// 	}
	// })
})
