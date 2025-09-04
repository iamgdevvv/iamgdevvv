'use client'
import {
	ActionIcon,
	Avatar,
	Burger,
	Group,
	HoverCard,
	HoverCardDropdown,
	HoverCardTarget,
	Stack,
	Text,
	Transition,
} from '@mantine/core'
import { useClickOutside, useDisclosure } from '@mantine/hooks'
import {
	Facebook,
	Github,
	Instagram,
	Linkedin,
	Mail,
	Moon,
	Music2,
	Phone,
	Sun,
	Twitter,
	Youtube,
} from 'lucide-react'
import { useId, type HTMLAttributes } from 'react'

import Image from '$components/Image'
import Link from '$components/Link'
import { useIsMedia } from '$hooks/media-query'
import { useThemeColor } from '$hooks/style'
import type { Profile, Site } from '$payload-types'
import { collectionLink } from '$utils/common'
import { cx } from '$utils/styles'

import styles from '$styles/layouts/header.module.css'

export type HeaderProps = {
	profile: Profile | null
	site: Site | null
} & HTMLAttributes<HTMLDivElement>

export default function Header({ site, profile, ...props }: HeaderProps) {
	const compId = useId()
	const [openNav, { close: closeNav, toggle: toggleNav }] = useDisclosure()
	const mediaQuery = useIsMedia()
	const refNavMobile = useClickOutside(() => closeNav())
	const { themeColor, setThemeColor } = useThemeColor()

	return (
		<header
			{...props}
			ref={refNavMobile}
			data-slot="header"
			className={cx(styles.header, props.className)}
		>
			<div className={cx(styles.inner, 'container')}>
				{/* Logo */}
				<div className={styles.branding}>
					<Link
						href="/"
						aria-label="Home"
						className={styles.logo}
					>
						<span className="sr-only">{profile?.name || site?.title} Logo</span>
						{site?.logo ? (
							<Image
								src={site.logo}
								width={48}
								height={48}
							/>
						) : profile?.avatar ? (
							<Image
								src={profile.avatar}
								width={48}
								height={48}
							/>
						) : profile?.avatarAlt ? (
							<Image
								src={profile.avatarAlt}
								width={48}
								height={48}
							/>
						) : (
							<Avatar name={profile?.name || site?.title || undefined} />
						)}
					</Link>
				</div>
				{/* Navigation Desktop */}
				{mediaQuery.desktop ? (
					<>
						{site?.navigation && site.navigation.length ? (
							<nav className={styles.navigation_desktop}>
								<ul className={styles.menu}>
									{site.navigation.map((navigation, index) => {
										if (navigation.submenu && navigation.submenu.length) {
											return (
												<HoverCard
													key={`nav-${compId}-${index}`}
													width={280}
													offset={10}
													withinPortal={false}
												>
													<HoverCardTarget>
														<li>
															<Link
																href={collectionLink(
																	navigation.link,
																)}
															>
																{navigation.label}
															</Link>
														</li>
													</HoverCardTarget>
													<HoverCardDropdown>
														<Stack
															gap="xs"
															p="md"
														>
															{navigation.submenu.map(
																(subNavigation, subIndex) => (
																	<Text
																		key={`nav-${compId}-${index}-${subIndex}`}
																		component={Link}
																		href={collectionLink(
																			subNavigation.link,
																		)}
																		size="sm"
																		fw={500}
																		className="hover:text-primary"
																	>
																		{subNavigation.label}
																	</Text>
																),
															)}
														</Stack>
													</HoverCardDropdown>
												</HoverCard>
											)
										}

										return (
											<li key={`nav-${compId}-${index}`}>
												<Link href={collectionLink(navigation.link)}>
													{navigation.label}
												</Link>
											</li>
										)
									})}
								</ul>
							</nav>
						) : null}
					</>
				) : null}

				<ActionIcon
					variant="subtle"
					size={mediaQuery.desktop ? 'lg' : 'md'}
					color={themeColor === 'light' ? 'secondary' : 'orange'}
					radius="sm"
					aria-label={themeColor === 'dark' ? 'Set Light Mode' : 'Set Dark Mode'}
					className={styles.menu_action}
					onClick={() => setThemeColor(themeColor === 'dark' ? 'light' : 'dark')}
				>
					{themeColor === 'dark' ? <Sun /> : <Moon />}
				</ActionIcon>

				{/* Hamburger */}
				{mediaQuery.belowDesktop ? (
					<Burger
						opened={openNav}
						onClick={toggleNav}
						size="md"
						color="secondary"
						aria-label={openNav ? 'Close Navigation Menu' : 'Open Navigation Menu'}
						className={styles.menu_action}
					/>
				) : null}

				<Transition mounted={mediaQuery.belowDesktop && openNav}>
					{(styleTransitions) => (
						<nav
							style={styleTransitions}
							className={styles.navigation_mobile}
						>
							<div className="container">
								{site?.navigation && site.navigation.length ? (
									<ul className={styles.menu}>
										{site.navigation.map((navigation, index) => (
											<li key={`nav-${compId}-${index}`}>
												<Link href={collectionLink(navigation.link)}>
													{navigation.label}
												</Link>
												{navigation.submenu && navigation.submenu.length ? (
													<Stack
														component="ul"
														pl="sm"
														gap={4}
													>
														{navigation.submenu.map(
															(subNavigation, subIndex) => (
																<li
																	key={`nav-${compId}-${index}-${subIndex}`}
																>
																	<Text
																		key={`nav-${compId}-${index}-${subIndex}`}
																		component={Link}
																		href={collectionLink(
																			subNavigation.link,
																		)}
																		size="sm"
																		fw={500}
																	>
																		{subNavigation.label}
																	</Text>
																</li>
															),
														)}
													</Stack>
												) : null}
											</li>
										))}
									</ul>
								) : null}

								<Group
									gap={4}
									mt="lg"
								>
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
						</nav>
					)}
				</Transition>
			</div>
		</header>
	)
}
