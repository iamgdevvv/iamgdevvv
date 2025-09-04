import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'

export const ListingToolBlock: Block = {
	slug: 'listingTool',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_ltlb'
		}

		return 'ltlb'
	},
	imageURL: '/blocks/listing-tool.jpg',
	fields: [
		{
			name: 'type',
			type: 'select',
			enumName: 'ltlbtyp',
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
					enumName: 'ltlbor',
					admin: {
						width: '25%',
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
					enumName: 'ltlborby',
					admin: {
						width: '25%',
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
						width: '25%',
					},
				},
				{
					type: 'select',
					name: 'pagination',
					enumName: 'ltlbpgn',
					admin: {
						width: '25%',
					},
					options: [
						{
							label: 'None',
							value: 'none',
						},
						{
							label: 'Paged',
							value: 'paged',
						},
						{
							label: 'Load More',
							value: 'load-more',
						},
						{
							label: 'Infinite Scroll',
							value: 'infinite-scroll',
						},
					],
				},
			],
		},
		styleField({
			gap: true,
			prefixFields: [
				{
					name: 'column',
					type: 'number',
					min: 1,
				},
			],
		}),
	],
}
