'use client'
import { Button, Center, Loader, Pagination, Skeleton, Stack, Text } from '@mantine/core'
import type { PaginatedDocs } from 'payload'
import { useCallback, useEffect, useId, useMemo, useState, useTransition } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { FadeContainer, FadeDiv } from '$components/Fade'
import { StyleGap } from '$components/Style'
import { SkeletonToolCard, ToolCard, type ToolCardProps } from '$layouts/Tool'
import { slugify } from '$utils/common'
import { queryListingTool, type ListingToolProps, type OptionsQueryListingTools } from './server'

import styles from '$styles/blocks/listing-tool.module.css'

export type ListingToolClientProps = ListingToolProps & {
	initialResult: PaginatedDocs<ToolCardProps['data']> | null
}

export default function ListingToolClient({
	block,
	initialResult,
	withContainer,
	...props
}: ListingToolClientProps) {
	if (!withContainer) {
		return (
			<ListingToolInner
				{...props}
				block={block}
				initialResult={initialResult}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="listing-tool"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ListingToolInner
						block={block}
						initialResult={initialResult}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ListingToolInner({ block, initialResult, ...props }: ListingToolClientProps) {
	const compId = useId()

	const [queryParams, setQueryParams] = useState<OptionsQueryListingTools | null>(null)
	const [prevTools, setPrevTools] = useState<ToolCardProps['data'][]>([])
	const [resultTools, setResultTools] = useState(initialResult)
	const [isLoading, startTransition] = useTransition()

	const refId = useMemo(() => {
		return (block.blockName || props.id || '') + slugify(compId)
	}, [block.blockName, compId, props.id])

	const column = useMemo(() => {
		return block.column || 3
	}, [block.column])

	const gap = useMemo(() => {
		return {
			base: block.gap?.base || '10px',
			vertical: block.gap?.vertical || block.gap?.base || '10px',
		}
	}, [block.gap])

	const tools = useMemo(() => {
		if (!resultTools) {
			return []
		}

		return resultTools?.docs
	}, [resultTools])

	const pagination = useMemo(() => {
		if (!block.pagination || !resultTools) {
			return null
		}

		return resultTools
	}, [block, resultTools])

	const isCountinuePagination = useMemo(() => {
		return block.pagination === 'infinite-scroll' || block.pagination === 'load-more'
	}, [block.pagination])

	const handlerPrevTools = useCallback(
		(enabled?: boolean) => {
			if (enabled !== false && isCountinuePagination) {
				setPrevTools([...prevTools, ...tools])
			} else {
				setPrevTools([])
			}
		},
		[isCountinuePagination, prevTools, tools],
	)

	const handlerPagination = useCallback(
		async (page: number) => {
			handlerPrevTools()

			setQueryParams({
				...queryParams,
				page,
			})
		},
		[handlerPrevTools, queryParams],
	)

	useEffect(() => {
		if (queryParams) {
			setResultTools(null)

			startTransition(async () => {
				const resultTool = await queryListingTool(block, queryParams)

				setResultTools(resultTool)
			})
		}
	}, [queryParams, block])

	return (
		<div
			{...props}
			data-slot="listing-tool-inner"
			id={refId}
			style={{
				...props.style,
				['--column' as string]: column,
			}}
		>
			{!tools.length && !isLoading ? (
				<Text
					c="dimmed"
					ta="center"
				>
					Tool tidak ditemukan.
				</Text>
			) : null}

			{block.pagination === 'infinite-scroll' ? (
				<ListingInfiniteScroll
					column={column}
					prevTools={prevTools}
					tools={tools}
					loading={isLoading}
					pagination={pagination}
					onPaging={handlerPagination}
				/>
			) : block.pagination === 'load-more' ? (
				<ListingLoadMore
					column={column}
					tools={tools}
					prevTools={prevTools}
					loading={isLoading}
				/>
			) : (
				<ListingDefault
					column={column}
					tools={tools}
					loading={isLoading}
				/>
			)}

			<PaginationListing
				block={block}
				data={pagination}
				loading={isLoading}
				onPaging={handlerPagination}
				className="mt-10"
			/>

			<StyleGap
				id={refId}
				data={gap}
			/>
		</div>
	)
}

function ListingDefault({
	column,
	tools,
	loading,
}: {
	column: number
	tools: ToolCardProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading) {
		return (
			<div className={styles.listing}>
				<SkeletonItems
					loading={loading}
					total={column}
				/>
			</div>
		)
	}

	if (tools.length) {
		return (
			<div className={styles.listing}>
				{tools.map((tool, index) => (
					<ToolCard
						data={tool}
						key={`${compId}-tool-${index}`}
					/>
				))}
			</div>
		)
	}

	return null
}

function ListingLoadMore({
	column,
	prevTools,
	tools,
	loading,
}: {
	column: number
	prevTools: ToolCardProps['data'][]
	tools: ToolCardProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading || tools.length || prevTools.length) {
		return (
			<div className={styles.listing}>
				{prevTools.map((tool, index) => (
					<ToolCard
						key={`${compId}-prevtool-${index}`}
						data={tool}
					/>
				))}
				{tools.map((tool, index) => (
					<ToolCard
						data={tool}
						key={`${compId}-tool-${index}`}
					/>
				))}
				<SkeletonItems
					loading={loading}
					total={column}
				/>
			</div>
		)
	}

	return null
}

function ListingInfiniteScroll({
	column,
	prevTools,
	tools,
	loading,
	pagination,
	onPaging,
}: {
	column: number
	prevTools: ToolCardProps['data'][]
	tools: ToolCardProps['data'][]
	loading?: boolean
	pagination: PaginatedDocs<ToolCardProps['data']> | null
	onPaging: (value: number) => void
}) {
	const compId = useId()

	return (
		<>
			<InfiniteScroll
				loader={null}
				dataLength={prevTools.length + tools.length}
				hasMore={pagination?.hasNextPage || false}
				className={styles.listing}
				next={() => {
					if (pagination?.page) {
						onPaging(pagination.page + 1)
					}
				}}
			>
				{prevTools.map((tool, index) => (
					<ToolCard
						key={`${compId}-prevtool-${index}`}
						data={tool}
					/>
				))}
				{tools.map((tool, index) => (
					<ToolCard
						data={tool}
						key={`${compId}-tool-${index}`}
					/>
				))}
			</InfiniteScroll>

			{pagination?.hasNextPage || loading ? (
				<Stack
					gap="var(--gap)"
					mt={{
						base: '24px',
						md: 'var(--gap-y)',
					}}
				>
					<div className={styles.listing}>
						<SkeletonItems
							loading={loading}
							total={column}
						/>
					</div>
					<Center>
						<Loader size="md" />
					</Center>
				</Stack>
			) : null}
		</>
	)
}

function SkeletonItems({ loading, total }: { loading?: boolean; total?: number }) {
	const compId = useId()

	if (!loading) {
		return null
	}

	return Array.from({
		length: total || 6,
	}).map((_, index) => <SkeletonToolCard key={`${compId}-${index}`} />)
}

function PaginationListing({
	data,
	block,
	loading,
	onPaging,
	className,
}: Pick<ListingToolClientProps, 'block'> & {
	data: PaginatedDocs<ToolCardProps['data']> | null
	loading?: boolean
	onPaging: (value: number) => void
	className?: string
}) {
	if (block.pagination === 'load-more' && (data?.hasNextPage || loading)) {
		return (
			<Center className={className}>
				{data?.hasNextPage ? (
					<Button
						size="lg"
						variant="light"
						loading={loading}
						onClick={() => {
							if (data.nextPage) {
								onPaging(data.nextPage)
							}
						}}
					>
						Muat lebih banyak
					</Button>
				) : loading ? (
					<Button
						size="lg"
						variant="light"
						rightSection={<Loader size="xs" />}
					>
						Loading...
					</Button>
				) : null}
			</Center>
		)
	}

	if (block.pagination === 'paged' && (data?.totalPages || loading)) {
		return (
			<Center className={className}>
				{data?.totalPages && data?.totalPages > 1 ? (
					<Pagination
						value={data.page}
						total={data.totalPages}
						onChange={onPaging}
					/>
				) : loading ? (
					<Skeleton
						w={280}
						maw="100%"
						h={32}
					/>
				) : null}
			</Center>
		)
	}
}
