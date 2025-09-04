import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'
import { richTextBasic } from '$payload-libs/richtext'

export const HeadingCertificationBlock: Block = {
	slug: 'headingCertification',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_hctfb'
		}

		return 'hctfb'
	},
	imageURL: '/blocks/heading-certification.jpg',
	fields: [
		{
			name: 'heading',
			type: 'richText',
			editor: richTextBasic(),
		},
		{
			type: 'collapsible',
			label: 'Certification',
			fields: [
				{
					name: 'type',
					type: 'select',
					enumName: 'hctfbtyp',
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
						condition: (_, siblingData) =>
							siblingData.type === 'selectedCertifications',
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
							enumName: 'hctfbor',
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
							enumName: 'hctfborby',
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
					enumName: 'hctfbaln',
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
