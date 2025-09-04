'use client'
import {
	AspectRatio,
	Badge,
	Box,
	Drawer,
	Group,
	SimpleGrid,
	Skeleton,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import dayjs from 'dayjs'
import { useId, useState, type ComponentProps, type HTMLAttributes } from 'react'

import Image from '$components/Image'
import Richtext from '$components/Richtext'
import { useThemeColor } from '$hooks/style'
import type { Asset, Experience } from '$payload-types'
import { assetUrl } from '$utils/common'

import stylesExperienceCard from '$styles/layouts/experience-card.module.css'

export type ExperienceCardProps = {
	data: Experience
} & HTMLAttributes<HTMLDivElement> &
	ComponentProps<typeof Box>

export function ExperienceCard({ data, ...props }: ExperienceCardProps) {
	const { themeColor } = useThemeColor()
	const compId = useId()
	const [mediaOpen, setMediaOpen] = useState<number | Asset | null>(null)

	return (
		<Box
			{...props}
			bg={themeColor === 'light' ? 'gray.0' : 'gray.9'}
			bd={themeColor === 'light' ? '1px solid gray.3' : '1px solid gray.7'}
			bdrs="lg"
			p={{
				base: 'lg',
				md: 'xl',
			}}
		>
			<Stack gap={0}>
				<Title
					order={3}
					size="h6"
				>
					{data.title}
				</Title>
				<Text
					component="span"
					size="sm"
				>
					{data.company}
					{data.location ? ` (${data.location})` : null}
				</Text>
				<Text
					component="span"
					size="sm"
					c="dimmed"
				>
					{data.status ? data.status + ' — ' : ''}
					{data.startDate ? (
						<>
							<time dateTime={dayjs(data.startDate).toISOString()}>
								{dayjs(data.startDate).format('DD MMM YYYY')} -{' '}
							</time>
							{data.endDate ? (
								<time>{dayjs(data.endDate).format('DD MMM YYYY')}</time>
							) : (
								<span>Present</span>
							)}
						</>
					) : null}
				</Text>
				<Richtext
					data={data.description}
					mt="xs"
				/>
				{data.skills && data.skills.length ? (
					<Group
						gap="xs"
						mt="xs"
					>
						{data.skills.map((skill, index) => {
							if (typeof skill !== 'object') return null

							return (
								<Badge
									key={`${compId}-skill-${index}`}
									variant="light"
									color="dark"
								>
									{skill.title}
								</Badge>
							)
						})}
					</Group>
				) : null}
				{data.gallery && data.gallery.length ? (
					<SimpleGrid
						spacing="xs"
						cols={{
							base: 2,
							md: 4,
						}}
						mt="lg"
					>
						{data.gallery.map((image, index) => (
							<AspectRatio
								key={`${compId}-image-${index}`}
								ratio={1.4142 / 1}
								bdrs="md"
								className={stylesExperienceCard.gallery_item}
								onClick={() => setMediaOpen(image)}
							>
								<Image
									src={assetUrl(image)}
									width={128}
									height={90}
								/>
							</AspectRatio>
						))}
					</SimpleGrid>
				) : null}
			</Stack>
			<Drawer
				opened={Boolean(mediaOpen)}
				position="bottom"
				size="98%"
				onClose={() => setMediaOpen(null)}
			>
				<Image
					src={assetUrl(mediaOpen)}
					width={1920}
					height={1080}
					className={stylesExperienceCard.full_media}
				/>
			</Drawer>
		</Box>
	)
}

export function SkeletonExperienceCard(props: Omit<ExperienceCardProps, 'data'>) {
	const compId = useId()
	const { themeColor } = useThemeColor()

	return (
		<Box
			{...props}
			bg={themeColor === 'light' ? 'gray.0' : 'gray.9'}
			bd={themeColor === 'light' ? '1px solid gray.3' : '1px solid gray.7'}
			bdrs="lg"
			p={{
				base: 'lg',
				md: 'xl',
			}}
		>
			<Stack gap={0}>
				<Skeleton
					w={280}
					maw="80%"
					h={22}
				/>
				<Skeleton
					w={200}
					maw="70%"
					h={14}
					mt={4}
				/>
				<Skeleton
					w={240}
					maw="90%"
					h={14}
					mt={4}
				/>
				<Stack
					gap={4}
					mt="xs"
				>
					<Skeleton
						w="90%"
						h={16}
					/>
					<Skeleton
						w="75%"
						h={16}
					/>
					<Skeleton
						w="80%"
						h={16}
					/>
				</Stack>
				<Group
					gap="xs"
					mt="xs"
				>
					{Array.from({ length: 4 }).map((_, index) => (
						<Skeleton
							key={`${compId}-skill-${index}`}
							w={68}
							h={18}
							radius="xl"
						/>
					))}
				</Group>
				<SimpleGrid
					spacing="xs"
					cols={{
						base: 2,
						md: 4,
					}}
					mt="lg"
				>
					{Array.from({ length: 2 }).map((image, index) => (
						<AspectRatio
							key={`${compId}-image-${index}`}
							ratio={1.4142 / 1}
							bdrs="md"
							className={stylesExperienceCard.gallery_item}
						>
							<Skeleton />
						</AspectRatio>
					))}
				</SimpleGrid>
			</Stack>
		</Box>
	)
}
