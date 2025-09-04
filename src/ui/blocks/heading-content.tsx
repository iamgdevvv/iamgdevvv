'use client'
import { Group, Title } from '@mantine/core'
import { type HTMLAttributes } from 'react'

import Richtext from '$components/Richtext'
import type { HeadingContent as HeadingContentBlock } from '$payload-types'

import styles from '$styles/blocks/heading-content.module.css'

export type HeadingContentProps = {
	block: HeadingContentBlock | Omit<HeadingContentBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export default function HeadingContent({ block, withContainer, ...props }: HeadingContentProps) {
	if (!withContainer) {
		return (
			<HeadingContentInner
				{...props}
				block={block}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="heading-content"
			id={block.blockName || props.id}
		>
			<HeadingContentInner
				block={block}
				className="container"
			/>
		</section>
	)
}

function HeadingContentInner({ block, ...props }: Omit<HeadingContentProps, 'withContainer'>) {
	return (
		<div
			{...props}
			data-slot="heading-content-inner"
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
				<Richtext
					data={block?.content}
					className={styles.content}
				/>
			</Group>
		</div>
	)
}
