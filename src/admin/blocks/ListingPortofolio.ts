import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'

export const ListingPortofolioBlock: Block = {
	slug: 'listingPortofolio',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_lpfb'
		}

		return 'lpfb'
	},
	imageURL: '/blocks/listing-portofolio.jpg',
	fields: [
		{
			name: 'type',
			type: 'select',
			enumName: 'lpfbtyp',
			options: [
				{
					label: 'Portofolios',
					value: 'portofolios',
				},
				{
					label: 'Selected Portofolios',
					value: 'selectedPortofolios',
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
			name: 'selectedPortofolios',
			type: 'relationship',
			relationTo: 'portofolios',
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'selectedPortofolios',
			},
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
					enumName: 'lpfbor',
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
					enumName: 'lpfborby',
					admin: {
						width: '33.333%',
					},
					options: [
						{
							label: 'Launch Date',
							value: 'launchDate',
						},
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
		{
			type: 'row',
			fields: [
				{
					type: 'checkbox',
					name: 'showFilter',
					admin: {
						width: '50%',
					},
				},
				{
					type: 'select',
					name: 'pagination',
					enumName: 'lpfbpgn',
					admin: {
						width: '50%',
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
