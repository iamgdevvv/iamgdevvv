import type { CollectionConfig } from 'payload'

import { authenticated } from '$payload-libs/access-rules'
import { revalidateChangeStatic, revalidateDeleteStatic } from '$payload-libs/hooks/revalidate'

export const Tools: CollectionConfig = {
	slug: 'tools',
	dbName: 'tlc',
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'updatedAt', 'author'],
		hidden: ({ user }) => user?.role === 'author',
		group: 'Personal',
	},
	access: {
		create: authenticated,
		read: () => true,
		update: authenticated,
		delete: authenticated,
	},
	hooks: {
		afterChange: [revalidateChangeStatic],
		afterDelete: [revalidateDeleteStatic],
	},
	fields: [
		{
			type: 'text',
			name: 'title',
		},
		{
			type: 'textarea',
			name: 'slogan',
		},
		{
			type: 'upload',
			relationTo: 'asset',
			name: 'icon',
		},
		{
			type: 'text',
			name: 'link',
		},
	],
}
