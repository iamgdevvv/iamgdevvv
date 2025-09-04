'use server'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import type { Options } from 'node_modules/payload/dist/collections/operations/local/find'
import { getPayload, type PaginatedDocs, type Where } from 'payload'

import configPromise from '$payload-config'
import type { Certification } from '$payload-types'

export type OptionsQueryCertifications = Omit<
	Options<'certifications', Record<keyof Certification, true>>,
	'collection'
> & {
	whereAnd?: Where['and']
	whereOr?: Where['or']
	search?: string
	queried?: Certification
	filter?: {
		ids?: number[]
		toolIds?: number[]
	}
}

const fieldSearch = ['title', 'company', 'status', 'location']

export const queryCertifications = async <
	T extends Partial<Record<keyof Certification, true>> | undefined,
>(
	options?: OptionsQueryCertifications,
	select?: T,
): Promise<PaginatedDocs<
	Pick<Certification, T extends undefined ? keyof Certification : keyof T>
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
			collection: 'certifications',
			limit,
			page,
			sort,
			select,
			where: {
				and: whereAnd,
				or: whereOr,
			},
		})

		cacheTag('collection', 'collection:certifications')

		return result
	} catch (error) {
		console.log('Error fetching certifications', { error })
		return null
	}
}
