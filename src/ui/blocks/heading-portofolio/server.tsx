'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { HeadingPortofolio as HeadingPortofolioBlock, Portofolio } from '$payload-types'
import { type OptionsQueryPortofolios, queryPortofolios } from '$server-functions/portofolio'
import HeadingPortofolioClient from './client'

export type HeadingPortofolioProps = {
	block: HeadingPortofolioBlock | Omit<HeadingPortofolioBlock, 'blockType'>
	queried?: Portofolio
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryHeadingPortofolios = Omit<OptionsQueryPortofolios, 'whereAnd' | 'whereOr'>

export const queryHeadingPortofolio = async (
	block: HeadingPortofolioProps['block'],
	options?: OptionsQueryHeadingPortofolios,
) => {
	let sort: Sort | undefined = undefined
	let search: OptionsQueryPortofolios['search'] = options?.search
	let limit = options?.limit || block.total || 4
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

export default async function HeadingPortofolio({
	block,
	queried,
	...props
}: HeadingPortofolioProps) {
	const resultPortofolios = await queryHeadingPortofolio(block, {
		queried,
	})

	return (
		<HeadingPortofolioClient
			{...props}
			block={block}
			portofolios={resultPortofolios?.docs || []}
		/>
	)
}
