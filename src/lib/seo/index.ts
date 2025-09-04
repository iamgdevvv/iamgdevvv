import type { Graph, Thing } from 'schema-dts'

import { slugPost } from '$modules/vars'
import type { Site } from '$payload-types'
import { blogSchema } from '$seo/blog'
import { blogPostingSchema } from '$seo/blog-post'
import { breadcrumbSchema } from '$seo/breadcrumb'
import { pageSchema } from '$seo/page'
import type { Queried } from '$type'

export type SeoDts = {
	site: Site | null
} & Queried

export const seoSchema = ({ data, collection, site }: SeoDts): Graph => {
	const graph: Thing[] = []

	if (site) {
		graph.push(breadcrumbSchema({ data, collection, site }))
	}

	if (collection === 'posts') {
		graph.push(blogPostingSchema(data))
	} else if (collection === 'pages' && data.slug === slugPost) {
		graph.push(blogSchema(data))
	} else {
		graph.push(pageSchema(data))
	}

	return {
		'@context': 'https://schema.org',
		'@graph': graph,
	}
}
