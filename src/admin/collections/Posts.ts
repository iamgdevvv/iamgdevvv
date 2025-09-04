import type { CollectionConfig } from 'payload'

import { afterReadHookLink } from '$payload-fields/link'
import { metafield } from '$payload-fields/metadata'
import {
	authenticated,
	authenticatedActionRole,
	authenticatedOrPublished,
} from '$payload-libs/access-rules'
import { revalidateChange, revalidateDelete } from '$payload-libs/hooks/revalidate'
import { generatePreviewPath } from '$payload-libs/preview-path'
import { collectionLink } from '$utils/common'

export const Posts: CollectionConfig = {
	slug: 'posts',
	dbName: 'poc',
	defaultPopulate: {
		id: true,
		title: true,
		slug: true,
		link: true,
		excerpt: true,
		featuredImage: true,
		category: true,
		publishedAt: true,
		createdAt: true,
		updatedAt: true,
	},
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', 'category', '_status', 'updatedAt'],
		group: 'Blog',
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
		read: authenticatedOrPublished,
		update: authenticatedActionRole,
		delete: authenticatedActionRole,
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
		...metafield({
			general: [
				{
					name: 'category',
					type: 'relationship',
					relationTo: 'postCategories',
				},
			],
		}),
	],
}
