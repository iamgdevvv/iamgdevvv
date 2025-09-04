import type { CollectionConfig } from 'payload'

import { metafield } from '$payload-fields/metadata'
import { authenticated, authenticatedActionRole } from '$payload-libs/access-rules'
import { revalidateChangeStatic, revalidateDeleteStatic } from '$payload-libs/hooks/revalidate'
import { generatePreviewPath } from '$payload-libs/preview-path'
import { collectionLink } from '$utils/common'

export const Reusables: CollectionConfig = {
	slug: 'reusables',
	dbName: 'rc',
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', 'updatedAt', 'author'],
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
	access: {
		create: authenticated,
		read: () => true,
		update: authenticatedActionRole,
		delete: authenticatedActionRole,
	},
	hooks: {
		afterChange: [revalidateChangeStatic],
		afterDelete: [revalidateDeleteStatic],
	},
	fields: [
		{
			name: 'content',
			type: 'blocks',
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
				'showReusable',
				'spacing',
			],
		},
		...metafield(),
	],
}
