import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'

export const ListingCertificationBlock: Block = {
	slug: 'listingCertification',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_lctfb'
		}

		return 'lctfb'
	},
	imageURL: '/blocks/listing-certification.jpg',
	fields: [
		{
			name: 'type',
			type: 'select',
			enumName: 'lctfbtyp',
			options: [
				{
					label: 'Certifications',
					value: 'certifications',
				},
				{
					label: 'Selected Certifications',
					value: 'selectedCertifications',
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
			name: 'selectedCertifications',
			type: 'relationship',
			relationTo: 'certifications',
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'selectedCertifications',
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
					enumName: 'lctfbor',
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
					enumName: 'lctfborby',
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
					enumName: 'lctfbpgn',
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
