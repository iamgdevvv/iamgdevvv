import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'
import { richTextBasic } from '$payload-libs/richtext'

export const HeadingPortofolioBlock: Block = {
	slug: 'headingPortofolio',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_hpfb'
		}

		return 'hpfb'
	},
	imageURL: '/blocks/heading-portofolio.jpg',
	fields: [
		{
			name: 'heading',
			type: 'richText',
			editor: richTextBasic(),
		},
		{
			type: 'collapsible',
			label: 'Portofolio',
			fields: [
				{
					name: 'type',
					type: 'select',
					enumName: 'hpfbtyp',
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
							enumName: 'hpfbor',
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
							enumName: 'hpfborby',
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
			],
		},
		styleField({
			gap: true,
			prefixFields: [
				{
					name: 'align',
					type: 'select',
					enumName: 'hpfbaln',
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
