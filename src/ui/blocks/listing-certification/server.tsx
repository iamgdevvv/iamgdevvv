'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { ListingCertification as ListingCertificationBlock } from '$payload-types'
import {
	type OptionsQueryCertifications,
	queryCertifications,
} from '$server-functions/certification'
import { queryTools } from '$server-functions/tool'
import ListingCertificationClient from './client'

export type ListingCertificationProps = {
	block: ListingCertificationBlock | Omit<ListingCertificationBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryListingCertifications = Omit<
	OptionsQueryCertifications,
	'whereAnd' | 'whereOr'
>

export const queryListingCertification = async (
	block: ListingCertificationProps['block'],
	options?: OptionsQueryListingCertifications,
) => {
	let sort: Sort | undefined = undefined
	let search: OptionsQueryCertifications['search'] = options?.search
	let limit = options?.limit || block.total || 1000000
	const certificationIds: number[] = []
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
		block.type === 'selectedCertifications' &&
		block.selectedCertifications &&
		!options?.filter?.ids
	) {
		limit = 100000

		block.selectedCertifications.forEach((certification) => {
			if (typeof certification === 'number') {
				certificationIds.push(certification)
			} else if (typeof certification === 'object' && certification.id) {
				certificationIds.push(certification.id)
			}
		})

		if (certificationIds.length === 0) {
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

	return await queryCertifications({
		...options,
		search,
		limit,
		sort,
		filter: {
			...options?.filter,
			ids: options?.filter?.ids || certificationIds,
			toolIds: options?.filter?.toolIds || toolIds,
		},
	})
}

const queryListingTools = async (block: ListingCertificationProps['block']) => {
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

export default async function ListingCertification({ block, ...props }: ListingCertificationProps) {
	const resultCertifications = await queryListingCertification(block)
	const resultTools = await queryListingTools(block)

	return (
		<ListingCertificationClient
			{...props}
			block={block}
			initialResult={resultCertifications}
			tools={resultTools}
		/>
	)
}
