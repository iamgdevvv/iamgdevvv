'use client'
import { ActionIcon, Group } from '@mantine/core'
import {
	Facebook,
	Github,
	Instagram,
	Linkedin,
	Mail,
	Music2,
	Phone,
	Twitter,
	Youtube,
} from 'lucide-react'
import { type HTMLAttributes } from 'react'

import Link from '$components/Link'
import Richtext from '$components/Richtext'
import type { Profile, Site } from '$payload-types'
import { cx } from '$utils/styles'

import styles from '$styles/layouts/footer.module.css'

const CURRENT_YEAR = new Date().getFullYear()

export type FooterProps = {
	profile: Profile | null
	site: Site | null
} & HTMLAttributes<HTMLDivElement>

export default function Footer({ profile, site, ...props }: FooterProps) {
	return (
		<footer
			{...props}
			data-slot="footer"
			className={cx(styles.footer, props.className)}
		>
			<div className={cx(styles.colophon, 'container')}>
				<div className={styles.copyright}>
					&copy; {CURRENT_YEAR}{' '}
					{site?.colophon ? (
						<Richtext
							data={site.colophon}
							basic
						/>
					) : (
						site?.title
					)}
				</div>
				<Group gap="xs">
					{profile?.socials?.email ? (
						<ActionIcon
							variant="subtle"
							component={Link}
							href={`mailto:${profile.socials.email}`}
							target="_blank"
						>
							<Mail size={20} />
						</ActionIcon>
					) : null}
					{profile?.socials?.telephone ? (
						<ActionIcon
							variant="subtle"
							component={Link}
							href={`tel:${profile.socials.telephone}`}
							target="_blank"
						>
							<Phone size={20} />
						</ActionIcon>
					) : null}
					{profile?.socials?.instagram ? (
						<ActionIcon
							variant="subtle"
							radius="sm"
							size="lg"
							component={Link}
							href={profile.socials.instagram}
							target="_blank"
						>
							<Instagram size={20} />
						</ActionIcon>
					) : null}
					{profile?.socials?.linkedin ? (
						<ActionIcon
							variant="subtle"
							radius="sm"
							size="lg"
							component={Link}
							href={profile.socials.linkedin}
							target="_blank"
						>
							<Linkedin size={20} />
						</ActionIcon>
					) : null}
					{profile?.socials?.facebook ? (
						<ActionIcon
							variant="subtle"
							radius="sm"
							size="lg"
							component={Link}
							href={profile.socials.facebook}
							target="_blank"
						>
							<Facebook size={20} />
						</ActionIcon>
					) : null}
					{profile?.socials?.tiktok ? (
						<ActionIcon
							variant="subtle"
							radius="sm"
							size="lg"
							component={Link}
							href={profile.socials.tiktok}
							target="_blank"
						>
							<Music2 size={20} />
						</ActionIcon>
					) : null}
					{profile?.socials?.twitter ? (
						<ActionIcon
							variant="subtle"
							radius="sm"
							size="lg"
							component={Link}
							href={profile.socials.twitter}
							target="_blank"
						>
							<Twitter size={20} />
						</ActionIcon>
					) : null}
					{profile?.socials?.youtube ? (
						<ActionIcon
							variant="subtle"
							radius="sm"
							size="lg"
							component={Link}
							href={profile.socials.youtube}
							target="_blank"
						>
							<Youtube size={20} />
						</ActionIcon>
					) : null}
					{profile?.socials?.github ? (
						<ActionIcon
							variant="subtle"
							component={Link}
							href={profile.socials.github}
							target="_blank"
						>
							<Github size={20} />
						</ActionIcon>
					) : null}
				</Group>
			</div>
		</footer>
	)
}
