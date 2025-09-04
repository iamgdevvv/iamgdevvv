import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'

export const ListingExperienceBlock: Block = {
	slug: 'listingExperience',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_lexb'
		}

		return 'lexb'
	},
	imageURL: '/blocks/listing-experience.jpg',
	fields: [
		{
			name: 'type',
			type: 'select',
			enumName: 'lexbtyp',
			options: [
				{
					label: 'Experiences',
					value: 'experiences',
				},
				{
					label: 'Selected Experiences',
					value: 'selectedExperiences',
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
			name: 'selectedExperiences',
			type: 'relationship',
			relationTo: 'experiences',
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'selectedExperiences',
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
					enumName: 'lexbor',
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
					enumName: 'lexborby',
					admin: {
						width: '33.333%',
					},
					options: [
						{
							label: 'Start Date',
							value: 'startDate',
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
					enumName: 'lexbpgn',
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
