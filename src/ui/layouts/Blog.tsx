'use client'
import { Button, Card, CardSection, Skeleton, Stack, Text, Title } from '@mantine/core'
import { type ComponentProps, type HTMLAttributes } from 'react'

import Image from '$components/Image'
import Link from '$components/Link'
import { useRouter } from '$hooks/use-router'
import type { Post } from '$payload-types'
import type { PostCategories } from '$server-functions/post'
import { collectionLink } from '$utils/common'
import { cx } from '$utils/styles'

import stylesBlogCard from '$styles/layouts/blog-card.module.css'
import stylesBlogCategoryCard from '$styles/layouts/blog-category-card.module.css'

export type BlogCardProps = {
	data: Pick<Post, 'title' | 'link' | 'excerpt' | 'featuredImage' | 'category'>
} & HTMLAttributes<HTMLDivElement> &
	ComponentProps<typeof Card>

export function BlogCard({ data, ...props }: BlogCardProps) {
	return (
		<Card
			{...props}
			p="md"
			pt={0}
			radius="lg"
			className={cx(stylesBlogCard.card, props.className)}
		>
			<CardSection
				mb={{
					base: 'sm',
					sm: 'lg',
				}}
			>
				<Link
					href={collectionLink(data.link)}
					className={stylesBlogCard.thumbnail}
				>
					<Image
						src={data.featuredImage}
						width={372}
						height={248}
					/>
				</Link>
			</CardSection>

			{data.category && typeof data.category === 'object' ? (
				<Button
					component={Link}
					href={collectionLink(data.category.link)}
					size="compact-xs"
					variant="light"
					color="secondary"
					className={stylesBlogCard.category}
				>
					{data.category.title}
				</Button>
			) : null}

			<div className={stylesBlogCard.content}>
				<Title
					order={5}
					className={stylesBlogCard.title}
				>
					<Link href={collectionLink(data.link)}>{data.title}</Link>
				</Title>

				{data.excerpt ? (
					<Text
						size="sm"
						c="dimmed"
						className={stylesBlogCard.excerpt}
					>
						{data.excerpt}
					</Text>
				) : null}
			</div>
		</Card>
	)
}

export type BlogCategoryCardProps = {
	data: Pick<PostCategories[number], 'id' | 'title' | 'link' | 'totalPost'>
} & HTMLAttributes<HTMLDivElement> &
	ComponentProps<typeof Card>

export function BlogCategoryCard({ data, ...props }: BlogCategoryCardProps) {
	const router = useRouter()

	return (
		<Card
			{...props}
			padding="lg"
			radius="lg"
			withBorder
			className={cx(stylesBlogCategoryCard.card, props.className)}
			onClick={(e) => {
				if (props.onClick) {
					props.onClick(e)
				} else {
					router.push(collectionLink(data.link))
				}
			}}
		>
			<Title
				order={5}
				className={stylesBlogCategoryCard.title}
			>
				<Link href={collectionLink(data.link)}>{data.title}</Link>
			</Title>

			<Text
				size="sm"
				c="dimmed"
				mt={0}
			>
				{String(data.totalPost).padStart(2, '0')} artikel
			</Text>
		</Card>
	)
}

export function SkeletonBlogCard(props: Partial<BlogCardProps>) {
	return (
		<Card
			{...props}
			padding="lg"
			radius="lg"
			withBorder
			className={cx(stylesBlogCard.card, props.className)}
		>
			<CardSection mb="lg">
				<Skeleton className={stylesBlogCard.thumbnail} />
			</CardSection>

			<div className={stylesBlogCard.content}>
				<Stack gap={6}>
					<Skeleton
						width="90%"
						height={24}
					/>
					<Skeleton
						width="60%"
						height={24}
					/>
				</Stack>

				<Stack
					gap={4}
					mt="md"
				>
					<Skeleton
						width="85%"
						height={18}
					/>
					<Skeleton
						width="80%"
						height={18}
					/>
					<Skeleton
						width="90%"
						height={18}
					/>
					<Skeleton
						width="90%"
						height={18}
					/>
				</Stack>

				<div className={stylesBlogCard.author}>
					<Skeleton className={stylesBlogCard.avatar} />
					<div className={stylesBlogCard.profile}>
						<Skeleton
							width="40%"
							height={14}
							mt={4}
							className={stylesBlogCard.name_profile}
						/>
						<Skeleton
							width="80%"
							height={14}
							className={stylesBlogCard.position_profile}
						/>
					</div>
				</div>
			</div>
		</Card>
	)
}
