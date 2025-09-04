import type { Block } from 'payload'

export const ProfileShowcaseBlock: Block = {
	slug: 'profileShowcase',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_pb'
		}

		return 'pb'
	},
	imageURL: '/blocks/profile-showcase.jpg',
	fields: [
		{
			name: 'socials',
			type: 'select',
			enumName: 'pbcscl',
			hasMany: true,
			options: [
				{
					label: 'Email',
					value: 'email',
				},
				{
					label: 'Telephone',
					value: 'telephone',
				},
				{
					label: 'Address',
					value: 'address',
				},
				{
					label: 'Linkedin',
					value: 'linkedin',
				},
				{
					label: 'Instagram',
					value: 'instagram',
				},
				{
					label: 'Tiktok',
					value: 'tiktok',
				},
				{
					label: 'Youtube',
					value: 'youtube',
				},
				{
					label: 'Facebook',
					value: 'facebook',
				},
				{
					label: 'Twitter',
					value: 'twitter',
				},
				{
					label: 'Github',
					value: 'github',
				},
			],
		},
	],
}
