'use server'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import configPromise from '$payload-config'
import { linkCollection } from '$payload-libs/link-utils'

export const postLoader = async (slug: string[]) => {
	'use cache'
	const payload = await getPayload({ config: configPromise })
	const { isEnabled: draft } = await draftMode()

	const slugPost = slug[slug.length - 1]

	const getPost = await payload.find({
		collection: 'posts',
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slugPost,
			},
		},
	})

	if (getPost.docs.length) {
		const postLink = slug.join('/')
		const post = getPost.docs[0]

		if (
			!draft &&
			post &&
			`/${postLink}` !==
				linkCollection({
					collection: 'posts',
					doc: post,
				})
		) {
			return null
		}

		cacheTag('collection', 'collection:posts')

		return post
	}

	return null
}

export const postCategoryLoader = async (slug: string[]) => {
	'use cache'
	const payload = await getPayload({ config: configPromise })
	const { isEnabled: draft } = await draftMode()

	const slugPostCategory = slug[slug.length - 1]

	const getPostCategory = await payload.find({
		collection: 'postCategories',
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slugPostCategory,
			},
		},
	})

	if (getPostCategory.docs.length) {
		const postCategoryLink = slug.join('/')
		const postCategory = getPostCategory.docs[0]

		if (
			!draft &&
			postCategory &&
			`/${postCategoryLink}` !==
				linkCollection({
					collection: 'postCategories',
					doc: postCategory,
				})
		) {
			return null
		}

		cacheTag('collection', 'collection:postCategories')

		return postCategory
	}

	return null
}

export const pageLoader = async (slug: string[]) => {
	'use cache'
	const payload = await getPayload({ config: configPromise })
	const { isEnabled: draft } = await draftMode()

	const slugPage = slug[slug.length - 1]

	const getPage = await payload.find({
		collection: 'pages',
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slugPage,
			},
		},
	})

	if (getPage.docs.length) {
		const pageLink = slug.join('/')
		const page = getPage.docs[0]
		const pageLinkResult = linkCollection({
			collection: 'pages',
			doc: page,
		})

		if (page) {
			if (!draft && pageLink !== 'home' && `/${pageLink}` !== pageLinkResult) {
				return null
			}

			cacheTag('collection', 'collection:pages')

			return page
		}
	}

	return null
}

export const portofolioLoader = async (slug: string[]) => {
	'use cache'
	const payload = await getPayload({ config: configPromise })
	const { isEnabled: draft } = await draftMode()

	const slugPortofolio = slug[slug.length - 1]

	const getPortofolio = await payload.find({
		collection: 'portofolios',
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slugPortofolio,
			},
		},
	})

	if (getPortofolio.docs.length) {
		const portofolioLink = slug.join('/')
		const portofolio = getPortofolio.docs[0]

		if (
			!draft &&
			portofolio &&
			`/${portofolioLink}` !==
				linkCollection({
					collection: 'portofolios',
					doc: portofolio,
				})
		) {
			return null
		}

		cacheTag('collection', 'collection:portofolios')

		return portofolio
	}

	return null
}

export const reusableLoader = async (slug: string[]) => {
	'use cache'
	const payload = await getPayload({ config: configPromise })
	const { isEnabled: draft } = await draftMode()

	const slugReusable = slug[slug.length - 1]

	const getReusable = await payload.find({
		collection: 'reusables',
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slugReusable,
			},
		},
	})

	if (getReusable.docs.length) {
		const reusableLink = slug.join('/')
		const reusable = getReusable.docs[0]

		if (
			!draft &&
			reusable &&
			`/${reusableLink}` !==
				linkCollection({
					collection: 'reusables',
					doc: reusable,
				})
		) {
			return null
		}

		cacheTag('collection', 'collection:reusables')

		return reusable
	}

	return null
}
