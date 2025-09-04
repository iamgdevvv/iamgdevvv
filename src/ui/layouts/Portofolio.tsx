'use client'
import { Badge, Box, Group, Skeleton, Stack, Text, Title } from '@mantine/core'
import dayjs from 'dayjs'
import { useId, useMemo, type ComponentProps, type HTMLAttributes } from 'react'

import Link from '$components/Link'
import type { Portofolio } from '$payload-types'
import { collectionLink } from '$utils/common'

export type PortofolioCardProps = {
	data: Portofolio
} & HTMLAttributes<HTMLDivElement> &
	ComponentProps<typeof Box>

export function PortofolioCard({ data, ...props }: PortofolioCardProps) {
	const compId = useId()

	const dateTime = useMemo(
		() => dayjs(data.launchDate || data.createdAt),
		[data.launchDate, data.createdAt],
	)

	return (
		<Stack
			{...props}
			component={Link}
			href={collectionLink(data.link)}
			gap={0}
			mt={{
				base: 'md',
				md: 0,
			}}
		>
			<Title
				order={3}
				size="h6"
			>
				{data.title}
			</Title>
			<Text
				component="time"
				dateTime={dateTime.toISOString()}
				size="sm"
				fs="italic"
				c="dimmed"
			>
				{dateTime.format('DD MMMM YYYY')}
			</Text>
			<Text>{data.excerpt}</Text>
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
		</Stack>
	)
}

export function SkeletonPortofolioCard(props: Omit<PortofolioCardProps, 'data'>) {
	const compId = useId()

	return (
		<Stack
			{...props}
			gap={0}
			mt={{
				base: 'md',
				md: 0,
			}}
		>
			<Skeleton
				w={280}
				maw="80%"
				h={22}
			/>
			<Skeleton
				w={160}
				maw="70%"
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
		</Stack>
	)
}
