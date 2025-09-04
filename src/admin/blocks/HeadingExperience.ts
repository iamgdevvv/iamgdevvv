import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'
import { richTextBasic } from '$payload-libs/richtext'

export const HeadingExperienceBlock: Block = {
	slug: 'headingExperience',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_heb'
		}

		return 'heb'
	},
	imageURL: '/blocks/heading-experience.jpg',
	fields: [
		{
			name: 'heading',
			type: 'richText',
			editor: richTextBasic(),
		},
		{
			type: 'collapsible',
			label: 'Experience',
			fields: [
				{
					name: 'type',
					type: 'select',
					enumName: 'hebtyp',
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
							enumName: 'hebor',
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
							enumName: 'heborby',
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
			],
		},
		styleField({
			gap: true,
			prefixFields: [
				{
					name: 'align',
					type: 'select',
					enumName: 'hebaln',
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
