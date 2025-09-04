import type { Block } from 'payload'

export const BaseContentBlock: Block = {
	slug: 'baseContent',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_bcb'
		}

		return 'bcb'
	},
	imageURL: '/blocks/base-content.jpg',
	fields: [
		{
			name: 'content',
			type: 'richText',
		},
		{
			name: 'align',
			type: 'select',
			enumName: 'bcbaln',
			options: [
				{
					label: 'Left',
					value: 'left',
				},
				{
					label: 'Right',
					value: 'right',
				},
				{
					label: 'Center',
					value: 'center',
				},
			],
		},
	],
}
