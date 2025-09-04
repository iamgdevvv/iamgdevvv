import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'
import { richTextBasic } from '$payload-libs/richtext'

export const HeadingToolBlock: Block = {
	slug: 'headingTool',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_htlb'
		}

		return 'htlb'
	},
	imageURL: '/blocks/heading-tool.jpg',
	fields: [
		{
			name: 'heading',
			type: 'richText',
			editor: richTextBasic(),
		},
		{
			type: 'collapsible',
			label: 'Tool',
			fields: [
				{
					name: 'type',
					type: 'select',
					enumName: 'htlbtyp',
					options: [
						{
							label: 'Tools',
							value: 'tools',
						},
						{
							label: 'Selected Tools',
							value: 'selectedTools',
						},
						{
							label: 'Search',
							value: 'search',
						},
					],
				},
				{
					name: 'selectedTools',
					type: 'relationship',
					relationTo: 'tools',
					hasMany: true,
					admin: {
						condition: (_, siblingData) => siblingData.type === 'selectedTools',
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
							enumName: 'htlbor',
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
							enumName: 'htlborby',
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
					enumName: 'htlbaln',
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
