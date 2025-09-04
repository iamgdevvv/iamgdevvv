import type { MetadataRoute } from 'next'

import {
	pageSitemap,
	portofolioSitemap,
	postCategorySitemap,
	postSitemap,
} from '$payload-libs/server/repos'
import { collectionLink } from '$utils/common'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [pages, posts, postCategories, portofolios] = await Promise.all([
		pageSitemap(),
		postSitemap(),
		postCategorySitemap(),
		portofolioSitemap(),
	])

	return [...pages, ...posts, ...postCategories, ...portofolios]
		.filter((post) => !!post.link)
		.map((post) => ({
			url: process.env.NEXT_PUBLIC_SITE_URL + collectionLink(post.link),
			lastModified: post.updatedAt,
			priority: 1,
		}))
}
