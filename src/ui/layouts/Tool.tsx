'use client'
import { Box, Center, Skeleton, Stack, Text, Title } from '@mantine/core'
import { type ComponentProps, type HTMLAttributes } from 'react'

import Image from '$components/Image'
import { useThemeColor } from '$hooks/style'
import type { Tool } from '$payload-types'
import { assetUrl } from '$utils/common'
import { cx } from '$utils/styles'

import stylesToolCard from '$styles/layouts/tool-card.module.css'

export type ToolCardProps = {
	data: Tool
} & HTMLAttributes<HTMLDivElement> &
	ComponentProps<typeof Box>

export type ToolListProps = {
	data: Tool
} & HTMLAttributes<HTMLDivElement> &
	ComponentProps<typeof Box>

export function ToolCard({ data, ...props }: ToolCardProps) {
	const { themeColor } = useThemeColor()

	return (
		<Box
			{...props}
			bg={themeColor === 'light' ? 'gray.0' : 'gray.9'}
			bd={themeColor === 'light' ? '1px solid gray.3' : '1px solid gray.7'}
			bdrs="lg"
			p="lg"
			className={cx(stylesToolCard.card, props.className)}
		>
			<Image
				src={assetUrl(data.icon)}
				className={stylesToolCard.icon}
			/>
			<Stack
				gap={0}
				className={stylesToolCard.content}
			>
				<Title
					order={3}
					fz="md"
				>
					{data.title}
				</Title>
				{data.slogan ? (
					<Text
						component="span"
						size="sm"
						c="dimmed"
					>
						{data.slogan}
					</Text>
				) : null}
			</Stack>
		</Box>
	)
}

export function SkeletonToolCard(props: Partial<ToolCardProps>) {
	const { themeColor } = useThemeColor()

	return (
		<Box
			{...props}
			bg={themeColor === 'light' ? 'gray.0' : 'gray.9'}
			bd={themeColor === 'light' ? '1px solid gray.3' : '1px solid gray.7'}
			bdrs="lg"
			p="lg"
			className={cx(stylesToolCard.card, props.className)}
		>
			<Skeleton className={stylesToolCard.icon} />
			<Stack
				gap={0}
				className={stylesToolCard.content}
			>
				<Skeleton
					w={120}
					maw="80%"
					h={22}
				/>
				<Skeleton
					w={220}
					maw="80%"
					h={14}
					mt={4}
				/>
			</Stack>
		</Box>
	)
}

export function ToolList({ data, ...props }: ToolListProps) {
	const { themeColor } = useThemeColor()

	return (
		<Box
			{...props}
			bg={themeColor === 'light' ? 'gray.0' : 'gray.9'}
			bd={themeColor === 'light' ? '1px solid gray.3' : '1px solid gray.7'}
			bdrs="lg"
			p="md"
		>
			<Title
				order={3}
				fz="sm"
				fw={600}
				ta="center"
			>
				{data.title}
			</Title>
		</Box>
	)
}

export function SkeletonToolList(props: Omit<ToolListProps, 'data'>) {
	const { themeColor } = useThemeColor()

	return (
		<Box
			{...props}
			bg={themeColor === 'light' ? 'gray.0' : 'gray.9'}
			bd={themeColor === 'light' ? '1px solid gray.3' : '1px solid gray.7'}
			bdrs="lg"
			p="md"
		>
			<Center>
				<Skeleton
					w={160}
					maw="80%"
					h={22}
				/>
			</Center>
		</Box>
	)
}
