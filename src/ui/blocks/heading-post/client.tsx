'use client'
import { Button, Group, Text, Title } from '@mantine/core'
import { LucideArrowRight } from 'lucide-react'
import { useId, useMemo } from 'react'

import { FadeContainer, FadeDiv } from '$components/Fade'
import Link from '$components/Link'
import Richtext from '$components/Richtext'
import { StyleGap } from '$components/Style'
import { BlogCard } from '$layouts/Blog'
import { slugPost } from '$modules/vars'
import type { Post } from '$payload-types'
import { slugify } from '$utils/common'
import { type HeadingPostProps } from './server'

import styles from '$styles/blocks/heading-post.module.css'

export type HeadingPostClientProps = HeadingPostProps & {
	posts: Post[]
}

export default function HeadingPostClient({
	block,
	posts,
	withContainer,
	...props
}: HeadingPostClientProps) {
	if (!withContainer) {
		return (
			<HeadingPostInner
				{...props}
				block={block}
				posts={posts}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="heading-post"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<HeadingPostInner
						block={block}
						posts={posts}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function HeadingPostInner({ block, posts, ...props }: HeadingPostClientProps) {
	const compId = useId()

	const refId = useMemo(() => {
		return (block.blockName || props.id || '') + slugify(compId)
	}, [block.blockName, compId, props.id])

	const column = useMemo(() => {
		return block.column || 2
	}, [block.column])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '16px',
			vertical: block.gap?.vertical || block.gap?.base || '16px',
		}
	}, [block.gap])

	return (
		<div
			{...props}
			data-slot="heading-post-inner"
			id={refId}
			style={{
				...props.style,
				['--column' as string]: column,
			}}
		>
			<Group
				gap={0}
				align="flex-start"
				data-align={block?.align || 'left'}
				className={styles.inner}
			>
				<Title
					order={2}
					size="h4"
					className={styles.heading}
				>
					<Richtext
						data={block?.heading}
						basic
					/>
				</Title>
				<div className={styles.posts}>
					{posts.length ? (
						<div className={styles.listing}>
							{posts.map((post, index) => (
								<BlogCard
									data={post}
									key={`${compId}-post-${index}`}
								/>
							))}
						</div>
					) : (
						<Text
							c="dimmed"
							ta="center"
						>
							Post tidak ditemukan.
						</Text>
					)}
				</div>
			</Group>

			<Group
				justify="flex-end"
				mt="xl"
			>
				<Button
					component={Link}
					href={`/${slugPost}`}
					variant="subtle"
					rightSection={<LucideArrowRight size={16} />}
				>
					Lihat Semua
				</Button>
			</Group>

			<StyleGap
				id={refId}
				data={gap}
			/>
		</div>
	)
}
