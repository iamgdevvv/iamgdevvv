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
	ExperienceCard,
	SkeletonExperienceCard,
	type ExperienceCardProps,
} from '$layouts/Experience'
import type { Tool } from '$payload-types'
import { slugify } from '$utils/common'
import {
	queryListingExperience,
	type ListingExperienceProps,
	type OptionsQueryListingExperiences,
} from './server'

import styles from '$styles/blocks/listing-experience.module.css'

export type ListingExperienceClientProps = ListingExperienceProps & {
	initialResult: PaginatedDocs<ExperienceCardProps['data']> | null
	tools: PaginatedDocs<Pick<Tool, 'id' | 'title'>> | null
}

export default function ListingExperienceClient({
	block,
	initialResult,
	tools,
	withContainer,
	...props
}: ListingExperienceClientProps) {
	if (!withContainer) {
		return (
			<ListingExperienceInner
				{...props}
				block={block}
				initialResult={initialResult}
				tools={tools}
			/>
		)
	}

	return (
		<section
			{...props}
			data-slot="listing-experience"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ListingExperienceInner
						block={block}
						initialResult={initialResult}
						tools={tools}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ListingExperienceInner({
	block,
	initialResult,
	tools,
	...props
}: ListingExperienceClientProps) {
	const compId = useId()

	const [queryParams, setQueryParams] = useState<OptionsQueryListingExperiences | null>(null)
	const [prevExperiences, setPrevExperiences] = useState<ExperienceCardProps['data'][]>([])
	const [resultExperiences, setResultExperiences] = useState(initialResult)
	const [isLoading, startTransition] = useTransition()

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

	const experiences = useMemo(() => {
		if (!resultExperiences) {
			return []
		}

		return resultExperiences?.docs
	}, [resultExperiences])

	const pagination = useMemo(() => {
		if (!block.pagination || !resultExperiences) {
			return null
		}

		return resultExperiences
	}, [block, resultExperiences])

	const isCountinuePagination = useMemo(() => {
		return block.pagination === 'infinite-scroll' || block.pagination === 'load-more'
	}, [block.pagination])

	const handlerPrevExperiences = useCallback(
		(enabled?: boolean) => {
			if (enabled !== false && isCountinuePagination) {
				setPrevExperiences([...prevExperiences, ...experiences])
			} else {
				setPrevExperiences([])
			}
		},
		[isCountinuePagination, prevExperiences, experiences],
	)

	const handlerSearch = useCallback(
		(value?: string | null) => {
			handlerPrevExperiences(false)

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
		[handlerPrevExperiences, queryParams],
	)

	const handlerTool = useCallback(
		(value?: string[] | null) => {
			handlerPrevExperiences(false)

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
		[handlerPrevExperiences, queryParams],
	)

	const handlerPagination = useCallback(
		async (page: number) => {
			handlerPrevExperiences()

			setQueryParams({
				...queryParams,
				page,
			})
		},
		[handlerPrevExperiences, queryParams],
	)

	useEffect(() => {
		if (queryParams) {
			setResultExperiences(null)

			startTransition(async () => {
				const resultExperience = await queryListingExperience(block, queryParams)

				setResultExperiences(resultExperience)
			})
		}
	}, [queryParams, block])

	return (
		<div
			{...props}
			data-slot="listing-experience-inner"
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

			{!experiences.length && !isLoading ? (
				<Text
					c="dimmed"
					ta="center"
				>
					Experience tidak ditemukan.
				</Text>
			) : null}

			{block.pagination === 'infinite-scroll' ? (
				<ListingInfiniteScroll
					column={column}
					prevExperiences={prevExperiences}
					experiences={experiences}
					loading={isLoading}
					pagination={pagination}
					onPaging={handlerPagination}
				/>
			) : block.pagination === 'load-more' ? (
				<ListingLoadMore
					column={column}
					experiences={experiences}
					prevExperiences={prevExperiences}
					loading={isLoading}
				/>
			) : (
				<ListingDefault
					column={column}
					experiences={experiences}
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
	experiences,
	loading,
}: {
	column: number
	experiences: ExperienceCardProps['data'][]
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

	if (experiences.length) {
		return (
			<div className={styles.listing}>
				{experiences.map((experience, index) => (
					<ExperienceCard
						data={experience}
						key={`${compId}-experience-${index}`}
					/>
				))}
			</div>
		)
	}

	return null
}

function ListingLoadMore({
	column,
	prevExperiences,
	experiences,
	loading,
}: {
	column: number
	prevExperiences: ExperienceCardProps['data'][]
	experiences: ExperienceCardProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading || experiences.length || prevExperiences.length) {
		return (
			<div className={styles.listing}>
				{prevExperiences.map((experience, index) => (
					<ExperienceCard
						key={`${compId}-prevexperience-${index}`}
						data={experience}
					/>
				))}
				{experiences.map((experience, index) => (
					<ExperienceCard
						data={experience}
						key={`${compId}-experience-${index}`}
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
	prevExperiences,
	experiences,
	loading,
	pagination,
	onPaging,
}: {
	column: number
	prevExperiences: ExperienceCardProps['data'][]
	experiences: ExperienceCardProps['data'][]
	loading?: boolean
	pagination: PaginatedDocs<ExperienceCardProps['data']> | null
	onPaging: (value: number) => void
}) {
	const compId = useId()

	return (
		<>
			<InfiniteScroll
				loader={null}
				dataLength={prevExperiences.length + experiences.length}
				hasMore={pagination?.hasNextPage || false}
				className={styles.listing}
				next={() => {
					if (pagination?.page) {
						onPaging(pagination.page + 1)
					}
				}}
			>
				{prevExperiences.map((experience, index) => (
					<ExperienceCard
						key={`${compId}-prevexperience-${index}`}
						data={experience}
					/>
				))}
				{experiences.map((experience, index) => (
					<ExperienceCard
						data={experience}
						key={`${compId}-experience-${index}`}
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
	}).map((_, index) => <SkeletonExperienceCard key={`${compId}-${index}`} />)
}

function FilterListing({
	data,
	block,
	tools,
	onChangeTool,
	onSearch,
}: Pick<ListingExperienceClientProps, 'block' | 'tools'> & {
	data: OptionsQueryListingExperiences | null
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
				placeholder="Cari experience..."
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
}: Pick<ListingExperienceClientProps, 'block'> & {
	data: PaginatedDocs<ExperienceCardProps['data']> | null
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
