import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'
import { richTextBasic } from '$payload-libs/richtext'

export const HeadingPostBlock: Block = {
	slug: 'headingPost',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_hpb'
		}

		return 'hpb'
	},
	imageURL: '/blocks/heading-post.jpg',
	fields: [
		{
			name: 'heading',
			type: 'richText',
			editor: richTextBasic(),
		},
		{
			type: 'collapsible',
			label: 'Post',
			fields: [
				{
					name: 'type',
					type: 'select',
					enumName: 'hpbtyp',
					options: [
						{
							label: 'Posts',
							value: 'posts',
						},
						{
							label: 'Selected Posts',
							value: 'selectedPosts',
						},
						{
							label: 'Selected Categories',
							value: 'selectedCategories',
						},
						{
							label: 'Search',
							value: 'search',
						},
					],
				},
				{
					name: 'selectedPosts',
					type: 'relationship',
					relationTo: 'posts',
					hasMany: true,
					admin: {
						condition: (_, siblingData) => siblingData.type === 'selectedPosts',
					},
				},
				{
					name: 'selectedCategories',
					type: 'relationship',
					relationTo: 'postCategories',
					hasMany: true,
					admin: {
						condition: (_, siblingData) => siblingData.type === 'selectedCategories',
					},
				},
				{
					name: 'search',
					type: 'text',
					admin: {
						condition: (_, siblingData) => siblingData.type === 'search',
					},
				},
				{
					type: 'row',
					fields: [
						{
							name: 'order',
							type: 'select',
							enumName: 'hpbor',
							admin: {
								width: '33.333%',
							},
							options: [
								{
									label: 'DESC',
									value: 'DESC',
								},
								{
									label: 'ASC',
									value: 'ASC',
								},
							],
						},
						{
							name: 'orderBy',
							type: 'select',
							enumName: 'hpborby',
							admin: {
								width: '33.333%',
							},
							options: [
								{
									label: 'Date',
									value: 'date',
								},
								{
									label: 'Title',
									value: 'title',
								},
							],
						},
						{
							name: 'total',
							type: 'number',
							min: 1,
							admin: {
								width: '33.333%',
							},
						},
					],
				},
			],
		},
		styleField({
			gap: true,
			prefixFields: [
				{
					name: 'align',
					type: 'select',
					enumName: 'hpbaln',
					options: [
						{
							label: 'Left',
							value: 'left',
						},
						{
							label: 'Center',
							value: 'center',
						},
						{
							label: 'Right',
							value: 'right',
						},
					],
				},
				{
					name: 'column',
					type: 'number',
					min: 1,
				},
			],
		}),
	],
}
