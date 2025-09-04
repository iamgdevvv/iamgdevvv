'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { ListingPortofolio as ListingPortofolioBlock, Portofolio } from '$payload-types'
import { type OptionsQueryPortofolios, queryPortofolios } from '$server-functions/portofolio'
import { queryTools } from '$server-functions/tool'
import ListingPortofolioClient from './client'

export type ListingPortofolioProps = {
	block: ListingPortofolioBlock | Omit<ListingPortofolioBlock, 'blockType'>
	queried?: Portofolio
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryListingPortofolios = Omit<OptionsQueryPortofolios, 'whereAnd' | 'whereOr'>

export const queryListingPortofolio = async (
	block: ListingPortofolioProps['block'],
	options?: OptionsQueryListingPortofolios,
) => {
	let sort: Sort | undefined = undefined
	let search: OptionsQueryPortofolios['search'] = options?.search
	let limit = options?.limit || block.total || 1000000
	const portofolioIds: number[] = []
	const toolIds: number[] = []

	if (options?.sort) {
		sort = options.sort
	} else {
		sort = block.order === 'ASC' ? '' : '-'

		if (block.orderBy === 'title') {
			sort += 'title'
		} else if (block.orderBy === 'date') {
			sort += 'publishedAt'
		} else {
			sort += 'launchDate'
		}
	}

	if (
		block.type === 'selectedPortofolios' &&
		block.selectedPortofolios &&
		!options?.filter?.ids
	) {
		limit = 100000

		block.selectedPortofolios.forEach((portofolio) => {
			if (typeof portofolio === 'number') {
				portofolioIds.push(portofolio)
			} else if (typeof portofolio === 'object' && portofolio.id) {
				portofolioIds.push(portofolio.id)
			}
		})

		if (portofolioIds.length === 0) {
			return null
		}
	} else if (block.type === 'selectedTools' && block.selectedTools && !options?.filter?.toolIds) {
		block.selectedTools.forEach((tool) => {
			if (typeof tool === 'object') {
				toolIds.push(tool.id)
			} else {
				toolIds.push(tool)
			}
		})

		if (toolIds.length === 0) {
			return null
		}
	} else if (block.type === 'search' && block.search && !search) {
		search = block.search
	}

	return await queryPortofolios({
		...options,
		search,
		limit,
		sort,
		filter: {
			...options?.filter,
			ids: options?.filter?.ids || portofolioIds,
			toolIds: options?.filter?.toolIds || toolIds,
		},
	})
}

const queryListingTools = async (block: ListingPortofolioProps['block']) => {
	if (!block.showFilter) {
		return null
	}

	return await queryTools(
		{
			limit: 1000000,
			pagination: false,
		},
		{
			id: true,
			title: true,
		},
	)
}

export default async function ListingPortofolio({
	block,
	queried,
	...props
}: ListingPortofolioProps) {
	const resultPortofolios = await queryListingPortofolio(block, {
		queried,
	})
	const resultTools = await queryListingTools(block)

	return (
		<ListingPortofolioClient
			{...props}
			block={block}
			initialResult={resultPortofolios}
			tools={resultTools}
			queried={queried}
		/>
	)
}
