import type { CollectionConfig } from 'payload'

import { afterReadHookLink } from '$payload-fields/link'
import { metafield } from '$payload-fields/metadata'
import { authenticated } from '$payload-libs/access-rules'
import { revalidateChange, revalidateDelete } from '$payload-libs/hooks/revalidate'
import { generatePreviewPath } from '$payload-libs/preview-path'
import { collectionLink } from '$utils/common'

export const Portofolios: CollectionConfig = {
	slug: 'portofolios',
	dbName: 'pfc',
	defaultPopulate: {
		id: true,
		title: true,
		slug: true,
		link: true,
		excerpt: true,
		featuredImage: true,
		launchDate: true,
		skills: true,
		actions: true,
		createdBy: true,
		publishedAt: true,
		createdAt: true,
		updatedAt: true,
	},
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', '_status', 'updatedAt', 'createdBy'],
		group: 'Personal',
		livePreview: {
			url: ({ data, req }) =>
				generatePreviewPath({
					path: collectionLink(data?.link, '/'),
					req,
				}),
		},
		preview: (data, { req }) =>
			generatePreviewPath({
				path: collectionLink(data?.link, '/'),
				req,
			}),
	},
	versions: {
		drafts: {
			autosave: false,
		},
		maxPerDoc: 10,
	},
	access: {
		create: authenticated,
		read: () => true,
		update: authenticated,
		delete: authenticated,
	},
	hooks: {
		afterRead: [afterReadHookLink],
		afterChange: [revalidateChange],
		afterDelete: [revalidateDelete],
	},
	fields: [
		{
			type: 'tabs',
			tabs: [
				{
					label: 'General',
					fields: [
						{
							type: 'date',
							name: 'launchDate',
						},
						{
							type: 'relationship',
							relationTo: 'tools',
							name: 'skills',
							hasMany: true,
						},
						{
							type: 'array',
							name: 'actions',
							dbName: (args) => {
								if (args.tableName) {
									return args.tableName + '_acs'
								}

								return 'pfc_acs'
							},
							fields: [
								{
									type: 'row',
									fields: [
										{
											type: 'text',
											name: 'icon',
											admin: {
												description:
													'Fill with name of icon from https://lucide.dev/icons',
												width: '20%',
											},
										},
										{
											type: 'text',
											name: 'label',
											admin: {
												width: '40%',
											},
										},
										{
											type: 'text',
											name: 'link',
											admin: {
												width: '40%',
											},
										},
									],
								},
							],
						},
					],
				},
				{
					label: 'Editor',
					fields: [
						{
							name: 'content',
							type: 'blocks',
							label: false,
							blocks: [],
							blockReferences: [
								'actions',
								'baseContent',
								'button',
								'cardForm',
								'collapsibleTab',
								'contentMedia',
								'divider',
								'gallery',
								'headingCertification',
								'headingContent',
								'headingExperience',
								'headingPortofolio',
								'headingPost',
								'headingTool',
								'listingCertification',
								'listingExperience',
								'listingPortofolio',
								'listingPost',
								'listingPostCategory',
								'listingTool',
								'media',
								'profileShowcase',
								'showReusable',
								'spacing',
							],
						},
					],
				},
			],
		},
		...metafield(),
	],
}
