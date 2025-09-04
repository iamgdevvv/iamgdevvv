'use server'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type PaginatedDocs, type Where } from 'payload'

import configPromise from '$payload-config'
import type { Experience } from '$payload-types'

export type OptionsQueryExperiences = Omit<
	Options<'experiences', Record<keyof Experience, true>>,
	'collection'
> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
	search?: string
	queried?: Experience
	filter?: {
		ids?: number[]
		toolIds?: number[]
	}
}

const fieldSearch = ['title', 'company', 'status', 'location']

export const queryExperiences = async <
	T extends Partial<Record<keyof Experience, true>> | undefined,
>(
	options?: OptionsQueryExperiences,
	select?: T,
): Promise<PaginatedDocs<
	Pick<Experience, T extends undefined ? keyof Experience : keyof T>
> | null> => {
	'use cache'
	try {
		const payload = await getPayload({ config: configPromise })

		const limit = options?.limit || 6
		const page = options?.page || 1
		const sort = options?.sort || '-startDate'
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
					not_equals: options.queried.id,
				},
			})
		}

		const result = await payload.find({
			collection: 'experiences',
			limit,
			page,
			sort,
			select,
			where: {
				and: whereAnd,
				or: whereOr,
			},
		})

		cacheTag('collection', 'collection:experiences')

		return result
	} catch (error) {
		console.log('Error fetching experiences', { error })
		return null
	}
}
