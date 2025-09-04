'use client'
import { Button, Group, Text, Title } from '@mantine/core'
import { LucideArrowRight } from 'lucide-react'
import { useId, useMemo } from 'react'

import { FadeContainer, FadeDiv } from '$components/Fade'
import Link from '$components/Link'
import Richtext from '$components/Richtext'
import { StyleGap } from '$components/Style'
import { PortofolioCard } from '$layouts/Portofolio'
import { slugPortofolio } from '$modules/vars'
import type { Portofolio } from '$payload-types'
import { slugify } from '$utils/common'
import { type HeadingPortofolioProps } from './server'

import styles from '$styles/blocks/heading-portofolio.module.css'

export type HeadingPortofolioClientProps = HeadingPortofolioProps & {
	portofolios: Portofolio[]
}

export default function HeadingPortofolioClient({
	block,
	portofolios,
	withContainer,
	...props
}: HeadingPortofolioClientProps) {
	if (!withContainer) {
		return (
			<HeadingPortofolioInner
				{...props}
				block={block}
				portofolios={portofolios}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="heading-portofolio"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<HeadingPortofolioInner
						block={block}
						portofolios={portofolios}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function HeadingPortofolioInner({ block, portofolios, ...props }: HeadingPortofolioClientProps) {
	const compId = useId()

	const refId = useMemo(() => {
		return (block.blockName || props.id || '') + slugify(compId)
	}, [block.blockName, compId, props.id])

	const column = useMemo(() => {
		return block.column || 1
	}, [block.column])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '32px',
			vertical: block.gap?.vertical || block.gap?.base || '32px',
		}
	}, [block.gap])

	return (
		<div
			{...props}
			data-slot="heading-portofolio-inner"
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
				<div className={styles.portofolio}>
					{portofolios.length ? (
						<div className={styles.listing}>
							{portofolios.map((portofolio, index) => (
								<PortofolioCard
									data={portofolio}
									key={`${compId}-portofolio-${index}`}
								/>
							))}
						</div>
					) : (
						<Text
							c="dimmed"
							ta="center"
						>
							Portofolio tidak ditemukan.
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
					href={`/${slugPortofolio}`}
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
