'use client'
import {
	ActionIcon,
	Button,
	Center,
	Group,
	Loader,
	MultiSelect,
	Pagination,
	Popover,
	PopoverDropdown,
	PopoverTarget,
	Skeleton,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	type OptionsData,
} from '@mantine/core'
import { Filter, Search } from 'lucide-react'
import type { PaginatedDocs } from 'payload'
import { useCallback, useEffect, useId, useMemo, useState, useTransition } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { FadeContainer, FadeDiv } from '$components/Fade'
import { StyleGap } from '$components/Style'
import {
	PortofolioCard,
	SkeletonPortofolioCard,
	type PortofolioCardProps,
} from '$layouts/Portofolio'
import type { Tool } from '$payload-types'
import { slugify } from '$utils/common'
import {
	queryListingPortofolio,
	type ListingPortofolioProps,
	type OptionsQueryListingPortofolios,
} from './server'

import styles from '$styles/blocks/listing-portofolio.module.css'

export type ListingPortofolioClientProps = ListingPortofolioProps & {
	initialResult: PaginatedDocs<PortofolioCardProps['data']> | null
	tools: PaginatedDocs<Pick<Tool, 'id' | 'title'>> | null
}

export default function ListingPortofolioClient({
	block,
	initialResult,
	queried,
	tools,
	withContainer,
	...props
}: ListingPortofolioClientProps) {
	if (!withContainer) {
		return (
			<ListingPortofolioInner
				{...props}
				block={block}
				initialResult={initialResult}
				queried={queried}
				tools={tools}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="listing-portofolio"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ListingPortofolioInner
						block={block}
						initialResult={initialResult}
						queried={queried}
						tools={tools}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ListingPortofolioInner({
	block,
	initialResult,
	queried,
	tools,
	...props
}: ListingPortofolioClientProps) {
	const compId = useId()

	const [queryParams, setQueryParams] = useState<OptionsQueryListingPortofolios | null>(null)
	const [prevPortofolios, setPrevPortofolios] = useState<PortofolioCardProps['data'][]>([])
	const [resultPortofolios, setResultPortofolios] = useState(initialResult)
	const [isLoading, startTransition] = useTransition()

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

	const portofolios = useMemo(() => {
		if (!resultPortofolios) {
			return []
		}

		return resultPortofolios?.docs
	}, [resultPortofolios])

	const pagination = useMemo(() => {
		if (!block.pagination || !resultPortofolios) {
			return null
		}

		return resultPortofolios
	}, [block, resultPortofolios])

	const isCountinuePagination = useMemo(() => {
		return block.pagination === 'infinite-scroll' || block.pagination === 'load-more'
	}, [block.pagination])

	const handlerPrevPortofolios = useCallback(
		(enabled?: boolean) => {
			if (enabled !== false && isCountinuePagination) {
				setPrevPortofolios([...prevPortofolios, ...portofolios])
			} else {
				setPrevPortofolios([])
			}
		},
		[isCountinuePagination, prevPortofolios, portofolios],
	)

	const handlerSearch = useCallback(
		(value?: string | null) => {
			handlerPrevPortofolios(false)

			if (value) {
				setQueryParams({
					...queryParams,
					page: 1,
					search: value,
				})
			} else {
				setQueryParams({
					...queryParams,
					page: 1,
					search: undefined,
				})
			}
		},
		[handlerPrevPortofolios, queryParams],
	)

	const handlerTool = useCallback(
		(value?: string[] | null) => {
			handlerPrevPortofolios(false)

			const toolIds: number[] = []

			value?.forEach((item) => {
				toolIds.push(Number(item))
			})

			setQueryParams({
				...queryParams,
				page: 1,
				filter: {
					...queryParams?.filter,
					toolIds,
				},
			})
		},
		[handlerPrevPortofolios, queryParams],
	)

	const handlerPagination = useCallback(
		async (page: number) => {
			handlerPrevPortofolios()

			setQueryParams({
				...queryParams,
				page,
			})
		},
		[handlerPrevPortofolios, queryParams],
	)

	useEffect(() => {
		if (queryParams) {
			setResultPortofolios(null)

			startTransition(async () => {
				const resultPortofolio = await queryListingPortofolio(block, {
					...queryParams,
					queried,
				})

				setResultPortofolios(resultPortofolio)
			})
		}
	}, [queryParams, block, queried])

	return (
		<div
			{...props}
			data-slot="listing-portofolio-inner"
			id={refId}
			style={{
				...props.style,
				['--column' as string]: column,
			}}
		>
			<FilterListing
				data={queryParams}
				block={block}
				tools={tools}
				onChangeTool={handlerTool}
				onSearch={handlerSearch}
			/>

			{!portofolios.length && !isLoading ? (
				<Text
					c="dimmed"
					ta="center"
				>
					Portofolio tidak ditemukan.
				</Text>
			) : null}

			{block.pagination === 'infinite-scroll' ? (
				<ListingInfiniteScroll
					column={column}
					prevPortofolios={prevPortofolios}
					portofolios={portofolios}
					loading={isLoading}
					pagination={pagination}
					onPaging={handlerPagination}
				/>
			) : block.pagination === 'load-more' ? (
				<ListingLoadMore
					column={column}
					portofolios={portofolios}
					prevPortofolios={prevPortofolios}
					loading={isLoading}
				/>
			) : (
				<ListingDefault
					column={column}
					portofolios={portofolios}
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
	portofolios,
	loading,
}: {
	column: number
	portofolios: PortofolioCardProps['data'][]
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

	if (portofolios.length) {
		return (
			<div className={styles.listing}>
				{portofolios.map((portofolio, index) => (
					<PortofolioCard
						data={portofolio}
						key={`${compId}-portofolio-${index}`}
					/>
				))}
			</div>
		)
	}

	return null
}

function ListingLoadMore({
	column,
	prevPortofolios,
	portofolios,
	loading,
}: {
	column: number
	prevPortofolios: PortofolioCardProps['data'][]
	portofolios: PortofolioCardProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading || portofolios.length || prevPortofolios.length) {
		return (
			<div className={styles.listing}>
				{prevPortofolios.map((portofolio, index) => (
					<PortofolioCard
						key={`${compId}-prevportofolio-${index}`}
						data={portofolio}
					/>
				))}
				{portofolios.map((portofolio, index) => (
					<PortofolioCard
						data={portofolio}
						key={`${compId}-portofolio-${index}`}
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
	prevPortofolios,
	portofolios,
	loading,
	pagination,
	onPaging,
}: {
	column: number
	prevPortofolios: PortofolioCardProps['data'][]
	portofolios: PortofolioCardProps['data'][]
	loading?: boolean
	pagination: PaginatedDocs<PortofolioCardProps['data']> | null
	onPaging: (value: number) => void
}) {
	const compId = useId()

	return (
		<>
			<InfiniteScroll
				loader={null}
				dataLength={prevPortofolios.length + portofolios.length}
				hasMore={pagination?.hasNextPage || false}
				className={styles.listing}
				next={() => {
					if (pagination?.page) {
						onPaging(pagination.page + 1)
					}
				}}
			>
				{prevPortofolios.map((portofolio, index) => (
					<PortofolioCard
						key={`${compId}-prevportofolio-${index}`}
						data={portofolio}
					/>
				))}
				{portofolios.map((portofolio, index) => (
					<PortofolioCard
						data={portofolio}
						key={`${compId}-portofolio-${index}`}
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
	}).map((_, index) => <SkeletonPortofolioCard key={`${compId}-${index}`} />)
}

function FilterListing({
	data,
	block,
	tools,
	onChangeTool,
	onSearch,
}: Pick<ListingPortofolioClientProps, 'block' | 'tools'> & {
	data: OptionsQueryListingPortofolios | null
	onSearch: (value: string) => void
	onChangeTool: (value?: string[] | null) => void
}) {
	const optionCategories = useMemo(() => {
		if (!tools || !tools.docs || !tools.docs.length) {
			return []
		}

		const options: OptionsData = []

		tools.docs.forEach((tool) => {
			if (tool.title) {
				options.push({
					value: String(tool.id),
					label: tool.title,
				})
			}
		})

		return options
	}, [tools])

	const defaultCategories = useMemo(() => {
		const toolIds: string[] = []

		if (block.type === 'selectedTools' && block.selectedTools && block.selectedTools.length) {
			block.selectedTools.forEach((tool) => {
				if (typeof tool === 'object') {
					toolIds.push(String(tool.id))
				} else {
					toolIds.push(String(tool))
				}
			})
		}

		return toolIds
	}, [block])

	const filterCategories = useMemo(() => {
		if (data?.filter?.toolIds) {
			const toolIds: string[] = []

			data.filter.toolIds.forEach((tool) => {
				toolIds.push(String(tool))
			})

			return toolIds
		}

		return null
	}, [data])

	if (!block.showFilter) {
		return null
	}

	return (
		<Group
			justify="flex-end"
			className={styles.filter}
		>
			<TextInput
				type="search"
				placeholder="Cari portofolio..."
				className={styles.search}
				rightSection={
					<ThemeIcon
						variant="light"
						className="pointer-events-none"
					>
						<Search size={14} />
					</ThemeIcon>
				}
				rightSectionProps={{
					className: 'cursor-pointer',
					onClick: (e) => {
						const value = (e.target as HTMLDivElement).parentNode?.querySelector(
							'input',
						)?.value

						if (value) {
							onSearch(value)
						}
					},
				}}
				onBlur={(e) => {
					if ('value' in e.target && !e.target.value) {
						onSearch(e.target.value)
					}
				}}
				onKeyUp={(e) => {
					if (
						e.key === 'Enter' &&
						'value' in e.target &&
						typeof e.target.value === 'string'
					) {
						onSearch(e.target.value)
					}
				}}
			/>
			<Popover position="bottom-end">
				<PopoverTarget>
					<ActionIcon
						variant="light"
						className={styles.cta_toggle}
					>
						<Filter />
					</ActionIcon>
				</PopoverTarget>
				<PopoverDropdown>
					<Stack
						gap="xs"
						w={{
							base: 'calc(100vw - 62px)',
							md: 280,
						}}
					>
						<MultiSelect
							data={optionCategories}
							value={filterCategories ? filterCategories : undefined}
							defaultValue={defaultCategories}
							clearable
							placeholder={
								!tools || !tools.docs.length ? 'Tool kosong' : 'Pilih tool'
							}
							comboboxProps={{
								withinPortal: false,
								position: 'bottom-end',
							}}
							disabled={!tools || !tools.docs.length}
							onChange={onChangeTool}
							onClear={onChangeTool}
						/>
					</Stack>
				</PopoverDropdown>
			</Popover>
		</Group>
	)
}

function PaginationListing({
	data,
	block,
	loading,
	onPaging,
	className,
}: Pick<ListingPortofolioClientProps, 'block'> & {
	data: PaginatedDocs<PortofolioCardProps['data']> | null
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
