'use client'
import { AspectRatio, Badge, Box, Drawer, Group, Skeleton, Stack, Text, Title } from '@mantine/core'
import dayjs from 'dayjs'
import { useId, useState, type ComponentProps, type HTMLAttributes } from 'react'

import Image from '$components/Image'
import Richtext from '$components/Richtext'
import { useThemeColor } from '$hooks/style'
import type { Asset, Certification } from '$payload-types'
import { assetUrl } from '$utils/common'

import stylesCertificationCard from '$styles/layouts/certification-card.module.css'

export type CertificationCardProps = {
	data: Certification
} & HTMLAttributes<HTMLDivElement> &
	ComponentProps<typeof Box>

export function CertificationCard({ data, ...props }: CertificationCardProps) {
	const compId = useId()
	const { themeColor } = useThemeColor()
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
				{data.publisher ? (
					<Text
						component="span"
						size="sm"
					>
						{data.publisher}
					</Text>
				) : null}
				{data.startDate ? (
					<Text
						component="span"
						size="sm"
						c="dimmed"
					>
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
				) : null}

				<Richtext
					data={data.content}
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
				{data.certificate ? (
					<AspectRatio
						ratio={16 / 10}
						bdrs="lg"
						className={stylesCertificationCard.certificate}
						mt="lg"
					>
						{typeof data.certificate === 'number' ? (
							<iframe
								src={assetUrl(data.certificate)}
								loading="lazy"
							/>
						) : data.certificate.mimeType &&
						  data.certificate.mimeType.startsWith('image') ? (
							<Image
								src={assetUrl(data.certificate)}
								width={786}
								height={492}
								onClick={() => setMediaOpen(data.certificate!)}
							/>
						) : (
							<iframe
								src={assetUrl(data.certificate)}
								loading="lazy"
							/>
						)}
					</AspectRatio>
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
					className={stylesCertificationCard.full_media}
				/>
			</Drawer>
		</Box>
	)
}

export function SkeletonCertificationCard(props: Omit<CertificationCardProps, 'data'>) {
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
				<AspectRatio
					ratio={16 / 10}
					bdrs="lg"
					className={stylesCertificationCard.certificate}
					mt="lg"
				>
					<Skeleton />
				</AspectRatio>
			</Stack>
		</Box>
	)
}
