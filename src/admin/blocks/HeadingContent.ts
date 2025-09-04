import type { Block } from 'payload'

import { richTextBasic } from '$root/lib/payload/richtext'

export const HeadingContentBlock: Block = {
	slug: 'headingContent',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_hcb'
		}

		return 'hcb'
	},
	imageURL: '/blocks/heading-content.jpg',
	fields: [
		{
			name: 'heading',
			type: 'richText',
			editor: richTextBasic(),
		},
		{
			name: 'content',
			type: 'richText',
		},
		{
			name: 'align',
			type: 'select',
			enumName: 'hcbaln',
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
	],
}
