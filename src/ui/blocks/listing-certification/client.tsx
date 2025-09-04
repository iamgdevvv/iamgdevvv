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
	CertificationCard,
	SkeletonCertificationCard,
	type CertificationCardProps,
} from '$layouts/Certification'
import type { Tool } from '$payload-types'
import { slugify } from '$utils/common'
import {
	queryListingCertification,
	type ListingCertificationProps,
	type OptionsQueryListingCertifications,
} from './server'

import styles from '$styles/blocks/listing-certification.module.css'

export type ListingCertificationClientProps = ListingCertificationProps & {
	initialResult: PaginatedDocs<CertificationCardProps['data']> | null
	tools: PaginatedDocs<Pick<Tool, 'id' | 'title'>> | null
}

export default function ListingCertificationClient({
	block,
	initialResult,
	tools,
	withContainer,
	...props
}: ListingCertificationClientProps) {
	if (!withContainer) {
		return (
			<ListingCertificationInner
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
			data-slot="listing-certification"
			id={block.blockName || props.id}
		>
			<FadeContainer className="container">
				<FadeDiv>
					<ListingCertificationInner
						block={block}
						initialResult={initialResult}
						tools={tools}
					/>
				</FadeDiv>
			</FadeContainer>
		</section>
	)
}

function ListingCertificationInner({
	block,
	initialResult,
	tools,
	...props
}: ListingCertificationClientProps) {
	const compId = useId()

	const [queryParams, setQueryParams] = useState<OptionsQueryListingCertifications | null>(null)
	const [prevCertifications, setPrevCertifications] = useState<CertificationCardProps['data'][]>(
		[],
	)
	const [resultCertifications, setResultCertifications] = useState(initialResult)
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

	const certifications = useMemo(() => {
		if (!resultCertifications) {
			return []
		}

		return resultCertifications?.docs
	}, [resultCertifications])

	const pagination = useMemo(() => {
		if (!block.pagination || !resultCertifications) {
			return null
		}

		return resultCertifications
	}, [block, resultCertifications])

	const isCountinuePagination = useMemo(() => {
		return block.pagination === 'infinite-scroll' || block.pagination === 'load-more'
	}, [block.pagination])

	const handlerPrevCertifications = useCallback(
		(enabled?: boolean) => {
			if (enabled !== false && isCountinuePagination) {
				setPrevCertifications([...prevCertifications, ...certifications])
			} else {
				setPrevCertifications([])
			}
		},
		[isCountinuePagination, prevCertifications, certifications],
	)

	const handlerSearch = useCallback(
		(value?: string | null) => {
			handlerPrevCertifications(false)

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
		[handlerPrevCertifications, queryParams],
	)

	const handlerTool = useCallback(
		(value?: string[] | null) => {
			handlerPrevCertifications(false)

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
		[handlerPrevCertifications, queryParams],
	)

	const handlerPagination = useCallback(
		async (page: number) => {
			handlerPrevCertifications()

			setQueryParams({
				...queryParams,
				page,
			})
		},
		[handlerPrevCertifications, queryParams],
	)

	useEffect(() => {
		if (queryParams) {
			setResultCertifications(null)

			startTransition(async () => {
				const resultCertification = await queryListingCertification(block, queryParams)

				setResultCertifications(resultCertification)
			})
		}
	}, [queryParams, block])

	return (
		<div
			{...props}
			data-slot="listing-certification-inner"
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

			{!certifications.length && !isLoading ? (
				<Text
					c="dimmed"
					ta="center"
				>
					Certification tidak ditemukan.
				</Text>
			) : null}

			{block.pagination === 'infinite-scroll' ? (
				<ListingInfiniteScroll
					column={column}
					prevCertifications={prevCertifications}
					certifications={certifications}
					loading={isLoading}
					pagination={pagination}
					onPaging={handlerPagination}
				/>
			) : block.pagination === 'load-more' ? (
				<ListingLoadMore
					column={column}
					certifications={certifications}
					prevCertifications={prevCertifications}
					loading={isLoading}
				/>
			) : (
				<ListingDefault
					column={column}
					certifications={certifications}
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
	certifications,
	loading,
}: {
	column: number
	certifications: CertificationCardProps['data'][]
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

	if (certifications.length) {
		return (
			<div className={styles.listing}>
				{certifications.map((certification, index) => (
					<CertificationCard
						data={certification}
						key={`${compId}-certification-${index}`}
					/>
				))}
			</div>
		)
	}

	return null
}

function ListingLoadMore({
	column,
	prevCertifications,
	certifications,
	loading,
}: {
	column: number
	prevCertifications: CertificationCardProps['data'][]
	certifications: CertificationCardProps['data'][]
	loading?: boolean
}) {
	const compId = useId()

	if (loading || certifications.length || prevCertifications.length) {
		return (
			<div className={styles.listing}>
				{prevCertifications.map((certification, index) => (
					<CertificationCard
						key={`${compId}-prevcertification-${index}`}
						data={certification}
					/>
				))}
				{certifications.map((certification, index) => (
					<CertificationCard
						data={certification}
						key={`${compId}-certification-${index}`}
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
	prevCertifications,
	certifications,
	loading,
	pagination,
	onPaging,
}: {
	column: number
	prevCertifications: CertificationCardProps['data'][]
	certifications: CertificationCardProps['data'][]
	loading?: boolean
	pagination: PaginatedDocs<CertificationCardProps['data']> | null
	onPaging: (value: number) => void
}) {
	const compId = useId()

	return (
		<>
			<InfiniteScroll
				loader={null}
				dataLength={prevCertifications.length + certifications.length}
				hasMore={pagination?.hasNextPage || false}
				className={styles.listing}
				next={() => {
					if (pagination?.page) {
						onPaging(pagination.page + 1)
					}
				}}
			>
				{prevCertifications.map((certification, index) => (
					<CertificationCard
						key={`${compId}-prevcertification-${index}`}
						data={certification}
					/>
				))}
				{certifications.map((certification, index) => (
					<CertificationCard
						data={certification}
						key={`${compId}-certification-${index}`}
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
	}).map((_, index) => <SkeletonCertificationCard key={`${compId}-${index}`} />)
}

function FilterListing({
	data,
	block,
	tools,
	onChangeTool,
	onSearch,
}: Pick<ListingCertificationClientProps, 'block' | 'tools'> & {
	data: OptionsQueryListingCertifications | null
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
				placeholder="Cari certification..."
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
}: Pick<ListingCertificationClientProps, 'block'> & {
	data: PaginatedDocs<CertificationCardProps['data']> | null
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
