'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { ListingTool as ListingToolBlock } from '$payload-types'
import { type OptionsQueryTools, queryTools } from '$server-functions/tool'
import ListingToolClient from './client'

export type ListingToolProps = {
	block: ListingToolBlock | Omit<ListingToolBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryListingTools = Omit<OptionsQueryTools, 'whereAnd' | 'whereOr'>

export const queryListingTool = async (
	block: ListingToolProps['block'],
	options?: OptionsQueryListingTools,
) => {
	let sort: Sort | undefined = undefined
	let search: OptionsQueryTools['search'] = options?.search
	let limit = options?.limit || block.total || 1000000
	const certificationIds: number[] = []

	if (options?.sort) {
		sort = options.sort
	} else {
		sort = block.order === 'DESC' ? '-' : ''

		if (block.orderBy === 'title') {
			sort += 'title'
		} else {
			sort += 'publishedAt'
		}
	}

	if (block.type === 'selectedTools' && block.selectedTools && !options?.filter?.ids) {
		limit = 100000

		block.selectedTools.forEach((certification) => {
			if (typeof certification === 'number') {
				certificationIds.push(certification)
			} else if (typeof certification === 'object' && certification.id) {
				certificationIds.push(certification.id)
			}
		})

		if (certificationIds.length === 0) {
			return null
		}
	} else if (block.type === 'search' && block.search && !search) {
		search = block.search
	}

	return await queryTools({
		...options,
		search,
		limit,
		sort,
		filter: {
			...options?.filter,
			ids: options?.filter?.ids || certificationIds,
		},
	})
}

export default async function ListingTool({ block, ...props }: ListingToolProps) {
	const resultTools = await queryListingTool(block)

	return (
		<ListingToolClient
			{...props}
			block={block}
			initialResult={resultTools}
		/>
	)
}
