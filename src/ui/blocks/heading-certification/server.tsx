'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { HeadingCertification as HeadingCertificationBlock } from '$payload-types'
import {
	type OptionsQueryCertifications,
	queryCertifications,
} from '$server-functions/certification'
import HeadingCertificationClient from './client'

export type HeadingCertificationProps = {
	block: HeadingCertificationBlock | Omit<HeadingCertificationBlock, 'blockType'>
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryHeadingCertifications = Omit<
	OptionsQueryCertifications,
	'whereAnd' | 'whereOr'
>

export const queryHeadingCertification = async (
	block: HeadingCertificationProps['block'],
	options?: OptionsQueryHeadingCertifications,
) => {
	let sort: Sort | undefined = undefined
	let search: OptionsQueryCertifications['search'] = options?.search
	let limit = options?.limit || block.total || 2
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

export default async function HeadingCertification({ block, ...props }: HeadingCertificationProps) {
	const resultCertifications = await queryHeadingCertification(block)

	return (
		<HeadingCertificationClient
			{...props}
			block={block}
			certifications={resultCertifications?.docs || []}
		/>
	)
}
