import type { Person } from 'schema-dts'

import type { Profile } from '$payload-types'
import { assetUrl } from '$utils/common'

export const personSchema = (profile: Profile): Person => {
	return {
		'@type': 'Person',
		name: profile.name || 'Unknown',
		description: profile.slogan || undefined,
		url: process.env.NEXT_PUBLIC_SITE_URL,
		image: assetUrl(profile.avatar || profile.avatarAlt),
		// jobTitle: profile.positions
		// 	?.filter((position) => typeof position === 'object')
		// 	.map((position) => position.title)
		// 	.join(', '),
	}
}
