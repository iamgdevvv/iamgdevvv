'use client'
import { ActionIcon, Button, CopyButton, Group, Notification, Stack } from '@mantine/core'
import { Copy, CopyCheck, Share2 } from 'lucide-react'
import { useCallback, useMemo, useState, type HTMLAttributes } from 'react'

import { useIsMedia } from '$hooks/media-query'
import type { Post } from '$payload-types'
import { collectionLink } from '$utils/common'
import { cx } from '$utils/styles'

import styles from '$styles/layouts/sidebar-post.module.css'

type Props = {
	data: Post
} & HTMLAttributes<HTMLDivElement>

export default function SidebarPost({ data, ...props }: Props) {
	const mediaQuery = useIsMedia()
	const [errorShare, setErrorShare] = useState(false)

	const postLink = useMemo(() => {
		return process.env.NEXT_PUBLIC_SITE_URL + collectionLink(data.link)
	}, [data.link])

	const handlerShare = useCallback(async () => {
		try {
			await navigator.share({
				title: data.title!,
				text: 'Check out this interesting blog post!',
				url: postLink,
			})
		} catch {
			setErrorShare(true)
		}
	}, [data, postLink])

	return (
		<aside
			{...props}
			className={cx(styles.sidebar, props.className)}
		>
			<div className={styles.sidebar_inner}>
				<div className={styles.share}>
					{mediaQuery.desktop ? (
						<Group gap="xs">
							<CopyButton value={postLink}>
								{({ copied, copy }) => (
									<Button
										variant={copied ? 'filled' : 'light'}
										color="primary"
										leftSection={
											copied ? (
												<CopyCheck size="1rem" />
											) : (
												<Copy size="1rem" />
											)
										}
										onClick={copy}
									>
										Salin link
									</Button>
								)}
							</CopyButton>
							<Button
								leftSection={<Share2 size="1rem" />}
								onClick={handlerShare}
							>
								Bagikan
							</Button>
						</Group>
					) : null}

					{mediaQuery.belowDesktop ? (
						<Stack
							gap={4}
							className={styles.share_inner}
						>
							<CopyButton value={postLink}>
								{({ copied, copy }) => (
									<ActionIcon
										size="xl"
										variant={copied ? 'filled' : 'light'}
										color="primary"
										radius="lg"
										onClick={copy}
									>
										{copied ? <CopyCheck size="1rem" /> : <Copy size="1rem" />}
									</ActionIcon>
								)}
							</CopyButton>
							<ActionIcon
								size="xl"
								radius="lg"
								onClick={handlerShare}
							>
								<Share2 size="1rem" />
							</ActionIcon>
						</Stack>
					) : null}
				</div>
			</div>
			{errorShare ? (
				<Notification title="Something went wrong">
					Share link failed, please try again
				</Notification>
			) : null}
		</aside>
	)
}
