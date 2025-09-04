import type { CollectionConfig } from 'payload'

import { authenticated } from '$payload-libs/access-rules'
import { revalidateChangeStatic, revalidateDeleteStatic } from '$payload-libs/hooks/revalidate'

export const Certifications: CollectionConfig = {
	slug: 'certifications',
	dbName: 'ctfc',
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'company', 'updatedAt', 'author'],
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
			type: 'row',
			fields: [
				{
					type: 'text',
					name: 'title',
					admin: {
						width: '33.333%',
					},
				},
				{
					type: 'text',
					name: 'publisher',
					admin: {
						width: '33.333%',
					},
				},
				{
					type: 'text',
					name: 'linkCourse',
					admin: {
						width: '33.333%',
					},
				},
			],
		},
		{
			type: 'row',
			fields: [
				{
					type: 'date',
					name: 'startDate',
					admin: {
						width: '25%',
					},
				},
				{
					type: 'date',
					name: 'endDate',
					admin: {
						description: 'Leave blank for ongoing',
						width: '25%',
					},
				},
				{
					type: 'relationship',
					relationTo: 'tools',
					name: 'skills',
					hasMany: true,
					admin: {
						width: '50%',
					},
				},
			],
		},
		{
			type: 'richText',
			name: 'content',
		},
		{
			type: 'upload',
			relationTo: 'asset',
			name: 'certificate',
		},
	],
}
