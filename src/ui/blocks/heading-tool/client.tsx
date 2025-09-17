'use client'
import { Group, Text, Title } from '@mantine/core'
import { useId, useMemo } from 'react'

import { FadeContainer, FadeDiv } from '$components/Fade'
import Richtext from '$components/Richtext'
import { StyleGap } from '$components/Style'
import { ToolList } from '$layouts/Tool'
import type { Tool } from '$payload-types'
import { slugify } from '$utils/common'
import { type HeadingToolProps } from './server'

import styles from '$styles/blocks/heading-tool.module.css'

export type HeadingToolClientProps = HeadingToolProps & {
	tools: Tool[]
}

export default function HeadingToolClient({
	block,
	tools,
	withContainer,
	...props
}: HeadingToolClientProps) {
	if (!withContainer) {
		return (
			<HeadingToolInner
				{...props}
				block={block}
				tools={tools}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="heading-tool"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<HeadingToolInner
						block={block}
						tools={tools}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function HeadingToolInner({ block, tools, ...props }: HeadingToolClientProps) {
	const compId = useId()

	const refId = useMemo(() => {
		return (block.blockName || props.id || '') + slugify(compId)
	}, [block.blockName, compId, props.id])

	const column = useMemo(() => {
		return block.column || 4
	}, [block.column])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '10px',
			vertical: block.gap?.vertical || block.gap?.base || '10px',
		}
	}, [block.gap])

	return (
		<div
			{...props}
			data-slot="heading-tool-inner"
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
				<div className={styles.tools}>
					{tools.length ? (
						<div className={styles.listing}>
							{tools.map((tool, index) => (
								<ToolList
									data={tool}
									key={`${compId}-tool-${index}`}
								/>
							))}
						</div>
					) : (
						<Text
							c="dimmed"
							ta="center"
						>
							Tool not found.
						</Text>
					)}
				</div>
			</Group>

			<StyleGap
				id={refId}
				data={gap}
			/>
		</div>
	)
}
