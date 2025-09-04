'use client'
import { Group, Text, Title } from '@mantine/core'
import { useId, useMemo } from 'react'

import { FadeContainer, FadeDiv } from '$components/Fade'
import Richtext from '$components/Richtext'
import { StyleGap } from '$components/Style'
import { ExperienceCard } from '$layouts/Experience'
import type { Experience } from '$payload-types'
import { slugify } from '$utils/common'
import { type HeadingExperienceProps } from './server'

import styles from '$styles/blocks/heading-experience.module.css'

export type HeadingExperienceClientProps = HeadingExperienceProps & {
	experiences: Experience[]
}

export default function HeadingExperienceClient({
	block,
	experiences,
	withContainer,
	...props
}: HeadingExperienceClientProps) {
	if (!withContainer) {
		return (
			<HeadingExperienceInner
				{...props}
				block={block}
				experiences={experiences}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="heading-experience"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<HeadingExperienceInner
						block={block}
						experiences={experiences}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function HeadingExperienceInner({ block, experiences, ...props }: HeadingExperienceClientProps) {
	const compId = useId()

	const refId = useMemo(() => {
		return (block.blockName || props.id || '') + slugify(compId)
	}, [block.blockName, compId, props.id])

	const column = useMemo(() => {
		return block.column || 1
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
			data-slot="heading-experience-inner"
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
				<div className={styles.experience}>
					{experiences.length ? (
						<div className={styles.listing}>
							{experiences.map((experience, index) => (
								<ExperienceCard
									data={experience}
									key={`${compId}-experience-${index}`}
								/>
							))}
						</div>
					) : (
						<Text
							c="dimmed"
							ta="center"
						>
							Experience tidak ditemukan.
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
