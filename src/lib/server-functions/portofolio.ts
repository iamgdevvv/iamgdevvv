'use server'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type PaginatedDocs, type Where } from 'payload'

import configPromise from '$payload-config'
import type { Portofolio } from '$payload-types'

export type OptionsQueryPortofolios = Omit<
	Options<'portofolios', Record<keyof Portofolio, true>>,
	'collection'
> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
	search?: string
	queried?: Portofolio
	filter?: {
		ids?: number[]
		toolIds?: number[]
	}
}

const fieldSearch = ['title', 'excerpt', 'meta.title', 'meta.description']

export const queryPortofolios = async <
	T extends Partial<Record<keyof Portofolio, true>> | undefined,
>(
	options?: OptionsQueryPortofolios,
	select?: T,
): Promise<PaginatedDocs<
	Pick<Portofolio, T extends undefined ? keyof Portofolio : keyof T>
> | null> => {
	'use cache'
	try {
		const payload = await getPayload({ config: configPromise })

		const limit = options?.limit || 6
		const page = options?.page || 1
		const sort = options?.sort || '-launchDate'
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

			if (options.filter.toolIds?.length) {
				whereAnd.push({
					skills: {
						in: options.filter.toolIds,
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
					not_equals: options?.queried?.id,
				},
			})
		}

		whereAnd.push({
			_status: {
				equals: 'published',
			},
		})

		const result = await payload.find({
			collection: 'portofolios',
			limit,
			page,
			sort,
			select,
			where: {
				and: whereAnd,
				or: whereOr,
			},
		})

		cacheTag('collection', 'collection:portofolios')

		return result
	} catch (error) {
		console.log('Error fetching portofolios', { error })
		return null
	}
}
