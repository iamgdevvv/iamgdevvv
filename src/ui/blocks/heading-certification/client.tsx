'use client'
import { Button, Group, Text, Title } from '@mantine/core'
import { LucideArrowRight } from 'lucide-react'
import { useId, useMemo } from 'react'

import { FadeContainer, FadeDiv } from '$components/Fade'
import Link from '$components/Link'
import Richtext from '$components/Richtext'
import { StyleGap } from '$components/Style'
import { CertificationCard } from '$layouts/Certification'
import { slugCertification } from '$modules/vars'
import type { Certification } from '$payload-types'
import { slugify } from '$utils/common'
import { type HeadingCertificationProps } from './server'

import styles from '$styles/blocks/heading-certification.module.css'

export type HeadingCertificationClientProps = HeadingCertificationProps & {
	certifications: Certification[]
}

export default function HeadingCertificationClient({
	block,
	certifications,
	withContainer,
	...props
}: HeadingCertificationClientProps) {
	if (!withContainer) {
		return (
			<HeadingCertificationInner
				{...props}
				block={block}
				certifications={certifications}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="heading-certification"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<HeadingCertificationInner
						block={block}
						certifications={certifications}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function HeadingCertificationInner({
	block,
	certifications,
	...props
}: HeadingCertificationClientProps) {
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
			data-slot="heading-certification-inner"
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
				<div className={styles.certification}>
					{certifications.length ? (
						<div className={styles.listing}>
							{certifications.map((certification, index) => (
								<CertificationCard
									data={certification}
									key={`${compId}-certification-${index}`}
								/>
							))}
						</div>
					) : (
						<Text
							c="dimmed"
							ta="center"
						>
							Certification tidak ditemukan.
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
					href={`/${slugCertification}`}
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
