'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { HeadingExperience as HeadingExperienceBlock } from '$payload-types'
import { type OptionsQueryExperiences, queryExperiences } from '$server-functions/experience'
import HeadingExperienceClient from './client'

export type HeadingExperienceProps = {
	block: HeadingExperienceBlock | Omit<HeadingExperienceBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryHeadingExperiences = Omit<OptionsQueryExperiences, 'whereAnd' | 'whereOr'>

export const queryHeadingExperience = async (
	block: HeadingExperienceProps['block'],
	options?: OptionsQueryHeadingExperiences,
) => {
	let sort: Sort | undefined = undefined
	let search: OptionsQueryExperiences['search'] = options?.search
	let limit = options?.limit || block.total || 1000000
	const experienceIds: number[] = []
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
			sort += 'startDate'
		}
	}

	if (
		block.type === 'selectedExperiences' &&
		block.selectedExperiences &&
		!options?.filter?.ids
	) {
		limit = 100000

		block.selectedExperiences.forEach((experience) => {
			if (typeof experience === 'number') {
				experienceIds.push(experience)
			} else if (typeof experience === 'object' && experience.id) {
				experienceIds.push(experience.id)
			}
		})

		if (experienceIds.length === 0) {
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

	return await queryExperiences({
		...options,
		search,
		limit,
		sort,
		filter: {
			...options?.filter,
			ids: options?.filter?.ids || experienceIds,
			toolIds: options?.filter?.toolIds || toolIds,
		},
	})
}

export default async function HeadingExperience({ block, ...props }: HeadingExperienceProps) {
	const resultExperiences = await queryHeadingExperience(block)

	return (
		<HeadingExperienceClient
			{...props}
			block={block}
			experiences={resultExperiences?.docs || []}
		/>
	)
}
