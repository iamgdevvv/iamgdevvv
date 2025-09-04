import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '$payload-libs/hooks/revalidate'

export const SiteConfig: GlobalConfig = {
	slug: 'site',
	access: {
		read: () => true,
	},
	admin: {
		hidden: ({ user }) => user?.role === 'author',
	},
	hooks: {
		afterChange: [revalidateGlobal],
	},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'General',
					fields: [
						{
							name: 'title',
							type: 'text',
						},
						{
							name: 'favicon',
							type: 'upload',
							relationTo: 'asset',
						},
						{
							name: 'darkTheme',
							type: 'checkbox',
							defaultValue: false,
						},
					],
				},
				{
					label: 'Header',
					fields: [
						{
							name: 'logo',
							type: 'upload',
							relationTo: 'asset',
						},
						{
							name: 'navigation',
							type: 'array',
							dbName: 'navs',
							minRows: 1,
							fields: [
								{
									type: 'row',
									fields: [
										{
											name: 'label',
											type: 'text',
											admin: {
												width: '50%',
											},
										},
										{
											name: 'link',
											type: 'text',
											admin: {
												width: '50%',
											},
										},
									],
								},
								{
									name: 'submenu',
									type: 'array',
									dbName: 'smnu',
									minRows: 1,
									fields: [
										{
											type: 'row',
											fields: [
												{
													name: 'label',
													type: 'text',
													admin: {
														width: '50%',
													},
												},
												{
													name: 'link',
													type: 'text',
													admin: {
														width: '50%',
													},
												},
											],
										},
									],
								},
							],
						},
					],
				},
				{
					label: 'Footer',
					fields: [
						{
							name: 'colophon',
							type: 'richText',
						},
					],
				},
				{
					label: 'Misc',
					fields: [
						{
							name: 'sitePublicly',
							type: 'checkbox',
							defaultValue: false,
							admin: {
								description: 'Encourage search engines from indexing this site',
							},
						},
						{
							name: 'googleAnalytics',
							type: 'text',
							admin: {
								description: 'Add your Google Analytics ID',
							},
						},
						{
							name: 'googleTagManager',
							type: 'text',
							admin: {
								description: 'Add your Google Tag Manager ID',
							},
						},
						{
							name: 'metaPixelID',
							type: 'text',
							admin: {
								description: 'Add your Meta Pixel ID',
							},
						},
						{
							name: 'tiktokPixelID',
							type: 'text',
							admin: {
								description: 'Add your TikTok Pixel ID',
							},
						},
					],
				},
			],
		},
	],
}
