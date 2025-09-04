'use client'
import { ActionIcon, Button, Group, Stack, Title } from '@mantine/core'
import {
	BriefcaseBusiness,
	Facebook,
	Github,
	Instagram,
	Linkedin,
	Mail,
	Map,
	Music2,
	Phone,
	Twitter,
	Youtube,
} from 'lucide-react'
import { useId, useMemo, type HTMLAttributes } from 'react'

import Image from '$components/Image'
import Link from '$components/Link'
import type { Profile, ProfileShowcase as ProfileShowcaseBlock } from '$payload-types'
import { cx } from '$utils/styles'

import styles from '$styles/blocks/profile-showcase.module.css'

export type ProfileShowcaseProps = {
	profile?: Profile | null
	block: ProfileShowcaseBlock | Omit<ProfileShowcaseBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

type Social = NonNullable<ProfileShowcaseBlock['socials']>[number]

export default function ProfileShowcase({
	block,
	profile,
	withContainer,
	...props
}: ProfileShowcaseProps) {
	if (!profile) {
		return null
	}

	if (!withContainer) {
		return (
			<ProfileShowcaseInner
				{...props}
				block={block}
				profile={profile}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="profile-showcase"
			id={block.blockName || props.id}
		>
			<ProfileShowcaseInner
				block={block}
				profile={profile}
				className="container"
			/>
		</section>
	)
}

function ProfileShowcaseInner({
	block,
	profile,
	...props
}: Omit<ProfileShowcaseProps, 'withContainer'>) {
	const compId = useId()

	const socials = useMemo(() => {
		const _socials: {
			social: Social
			link: string
		}[] = []
		const profileSocials = profile?.socials

		if (!profileSocials) {
			return []
		}

		if (!block.socials) {
			Object.entries(profileSocials).forEach(([key, value]) => {
				if (value) {
					let link = value

					if (key === 'address') {
						link = `http://maps.google.com/maps?q=${value}`
					} else if (key === 'email') {
						link = `mailto:${value}`
					} else if (key === 'telephone') {
						link = `tel:${value}`
					}

					_socials.push({
						social: key as Social,
						link,
					})
				}
			})
		} else {
			block.socials.forEach((social) => {
				if (social in profileSocials && profileSocials[social]) {
					let link = profileSocials[social]

					if (social === 'address') {
						link = `http://maps.google.com/maps?q=${profileSocials[social]}`
					} else if (social === 'email') {
						link = `mailto:${profileSocials[social]}`
					} else if (social === 'telephone') {
						link = `tel:${profileSocials[social]}`
					}

					_socials.push({
						social,
						link,
					})
				}
			})
		}

		return _socials
	}, [block, profile])

	return (
		<div
			{...props}
			data-slot="profile-showcase-inner"
			className={cx(styles.wrapper, props.className)}
		>
			<Stack align="center">
				<div className={styles.photo_profile}>
					{profile?.avatar ? (
						<Image
							src={profile.avatar}
							className={styles.basic_photo}
						/>
					) : null}
					{profile?.avatarAlt ? (
						<Image
							src={profile.avatarAlt}
							className={styles.art_photo}
						/>
					) : null}
				</div>
				<Title mt={0}>{profile?.name}</Title>
				<Group gap="lg">
					{profile?.title ? (
						<Button
							variant="transparent"
							component="div"
							size="compact-sm"
							px={0}
							leftSection={<BriefcaseBusiness size={20} />}
						>
							{profile.title}
						</Button>
					) : null}
					{socials.map(({ social, link }) => (
						<ActionIcon
							key={`${compId}-${social}`}
							size="compact-sm"
							variant="transparent"
							component={Link}
							href={link}
							target="_blank"
						>
							{social === 'email' ? (
								<Mail size={20} />
							) : social === 'address' ? (
								<Map size={20} />
							) : social === 'facebook' ? (
								<Facebook size={20} />
							) : social === 'github' ? (
								<Github size={20} />
							) : social === 'instagram' ? (
								<Instagram size={20} />
							) : social === 'linkedin' ? (
								<Linkedin size={20} />
							) : social === 'twitter' ? (
								<Twitter size={20} />
							) : social === 'tiktok' ? (
								<Music2 size={20} />
							) : social === 'youtube' ? (
								<Youtube size={20} />
							) : social === 'telephone' ? (
								<Phone size={20} />
							) : null}
						</ActionIcon>
					))}
				</Group>
			</Stack>
		</div>
	)
}
