'use server'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type PaginatedDocs, type Where } from 'payload'

import configPromise from '$payload-config'
import type { Tool } from '$payload-types'

export type OptionsQueryTools = Omit<Options<'tools', Record<keyof Tool, true>>, 'collection'> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
	search?: string
	queried?: Tool
	filter?: {
		ids?: number[]
	}
}

const fieldSearch = ['title', 'slogan']

export const queryTools = async <T extends Partial<Record<keyof Tool, true>> | undefined>(
	options?: OptionsQueryTools,
	select?: T,
): Promise<PaginatedDocs<Pick<Tool, T extends undefined ? keyof Tool : keyof T>> | null> => {
	'use cache'
	try {
		const payload = await getPayload({ config: configPromise })

		const limit = options?.limit || 6
		const page = options?.page || 1
		const sort = options?.sort || '-publishedAt'
		const whereAnd: Where['and'] = options?.whereAnd || []
		const whereOr: Where['and'] = options?.whereOr || []

		if (options?.filter) {
			if (options.filter.ids?.length) {
				whereAnd.push({
					id: {
						in: options.filter.ids,
					},
				})
			}
		}

		if (options?.search) {
			const whereSearch: Where['or'] = []

			fieldSearch.forEach((field) => {
				whereSearch.push({
					[field]: {
						contains: options.search,
					},
				})
			})

			whereAnd.push({
				or: whereSearch,
			})
		}

		if (options?.queried?.id) {
			whereAnd.push({
				id: {
					not_equals: options.queried.id,
				},
			})
		}

		const result = await payload.find({
			collection: 'tools',
			limit,
			page,
			sort,
			select,
			where: {
				and: whereAnd,
				or: whereOr,
			},
		})

		cacheTag('collection', 'collection:tools')

		return result
	} catch (error) {
		console.log('Error fetching tools', { error })
		return null
	}
}
