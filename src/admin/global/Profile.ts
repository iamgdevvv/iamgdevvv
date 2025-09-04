import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '$payload-libs/hooks/revalidate'

export const ProfileConfig: GlobalConfig = {
	slug: 'profile',
	access: {
		read: () => true,
	},
	admin: {
		hidden: ({ user }) => user?.role === 'author',
		group: 'Personal',
	},
	hooks: {
		afterChange: [revalidateGlobal],
	},
	fields: [
		{
			type: 'row',
			fields: [
				{
					name: 'avatar',
					type: 'upload',
					relationTo: 'asset',
					admin: {
						width: '50%',
					},
				},
				{
					name: 'avatarAlt',
					type: 'upload',
					relationTo: 'asset',
					admin: {
						width: '50%',
					},
				},
			],
		},
		{
			type: 'text',
			name: 'name',
		},
		{
			type: 'text',
			name: 'title',
		},
		{
			type: 'textarea',
			name: 'slogan',
		},
		{
			type: 'group',
			name: 'socials',
			fields: [
				{
					type: 'row',
					fields: [
						{
							type: 'text',
							name: 'email',
							admin: {
								width: '33.333%',
							},
						},
						{
							type: 'text',
							name: 'telephone',
							admin: {
								width: '33.333%',
							},
						},
						{
							type: 'text',
							name: 'address',
							admin: {
								width: '33.333%',
							},
						},
						{
							type: 'text',
							name: 'linkedin',
							admin: {
								width: '33.333%',
							},
						},
						{
							type: 'text',
							name: 'instagram',
							admin: {
								width: '33.333%',
							},
						},
						{
							type: 'text',
							name: 'tiktok',
							admin: {
								width: '33.333%',
							},
						},
						{
							type: 'text',
							name: 'youtube',
							admin: {
								width: '33.333%',
							},
						},
						{
							type: 'text',
							name: 'facebook',
							admin: {
								width: '33.333%',
							},
						},
						{
							type: 'text',
							name: 'twitter',
							admin: {
								width: '33.333%',
							},
						},
						{
							type: 'text',
							name: 'github',
							admin: {
								width: '33.333%',
							},
						},
					],
				},
			],
		},
	],
}
