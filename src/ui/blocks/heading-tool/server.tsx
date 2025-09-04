'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { HeadingTool as HeadingToolBlock } from '$payload-types'
import { type OptionsQueryTools, queryTools } from '$server-functions/tool'
import HeadingToolClient from './client'

export type HeadingToolProps = {
	block: HeadingToolBlock | Omit<HeadingToolBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryHeadingTools = Omit<OptionsQueryTools, 'whereAnd' | 'whereOr'>

export const queryHeadingTool = async (
	block: HeadingToolProps['block'],
	options?: OptionsQueryHeadingTools,
) => {
	let sort: Sort | undefined = undefined
	let search: OptionsQueryTools['search'] = options?.search
	let limit = options?.limit || block.total || 1000000
	const toolIds: number[] = []

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

		block.selectedTools.forEach((tool) => {
			if (typeof tool === 'number') {
				toolIds.push(tool)
			} else if (typeof tool === 'object' && tool.id) {
				toolIds.push(tool.id)
			}
		})

		if (toolIds.length === 0) {
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
			ids: options?.filter?.ids || toolIds,
		},
	})
}

export default async function HeadingTool({ block, ...props }: HeadingToolProps) {
	const resultTools = await queryHeadingTool(block)

	return (
		<HeadingToolClient
			{...props}
			block={block}
			tools={resultTools?.docs || []}
		/>
	)
}
