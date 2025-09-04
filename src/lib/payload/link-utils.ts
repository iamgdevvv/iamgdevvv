import type { CollectionSlug } from 'payload'

import { slugHomepage, slugPortofolio, slugPost, slugReusable } from '$modules/vars'
import type { Page, Portofolio, Post, PostCategory, Reusable } from '$payload-types'

export const slugPostType: Record<CollectionSlug, string> = {
	asset: '',
	pages: '',
	posts: slugPost,
	postCategories: slugPost,
	reusables: slugReusable,
	portofolios: slugPortofolio,
	certifications: '',
	experiences: '',
	tools: '',
	users: '',
	forms: '',
	'form-submissions': '',
	'payload-locked-documents': '',
	'payload-preferences': '',
	'payload-migrations': '',
}

type LinkCollectionParams =
	| {
			collection: 'posts'
			doc: Pick<Post, 'slug' | 'category'>
	  }
	| {
			collection: 'postCategories'
			doc: Pick<PostCategory, 'slug'>
	  }
	| {
			collection: 'pages'
			doc: Pick<Page, 'slug' | 'parentPage'>
	  }
	| {
			collection: 'portofolios'
			doc: Pick<Portofolio, 'slug'>
	  }
	| {
			collection: 'reusables'
			doc: Pick<Reusable, 'slug'>
	  }
	| {
			collection: 'asset'
			doc?: unknown
	  }
	| {
			collection: 'certifications'
			doc?: unknown
	  }
	| {
			collection: 'experiences'
			doc?: unknown
	  }
	| {
			collection: 'tools'
			doc?: unknown
	  }
	| {
			collection: 'users'
			doc?: unknown
	  }
	| {
			collection: 'forms'
			doc?: unknown
	  }
	| {
			collection: 'form-submissions'
			doc?: unknown
	  }
	| {
			collection: 'payload-locked-documents'
			doc?: unknown
	  }
	| {
			collection: 'payload-preferences'
			doc?: unknown
	  }
	| {
			collection: 'payload-migrations'
			doc?: unknown
	  }

export function linkCollection({ collection, doc }: LinkCollectionParams) {
	let link = '/'

	if (collection === 'posts') {
		link = `/${slugPostType[collection]}/uncategorized/${doc.slug || ''}`

		if (doc.category && typeof doc.category === 'object') {
			link = link.replace('uncategorized', doc.category.slug || '')
		}

		return link
	}

	if (collection === 'postCategories') {
		return `/${slugPostType[collection]}/${doc.slug || ''}`
	}

	if (collection === 'portofolios') {
		return `/${slugPostType[collection]}/${doc.slug || ''}`
	}

	if (collection === 'reusables') {
		return `/${slugPostType[collection]}/${doc.slug || ''}`
	}

	if (collection === 'pages' && doc.slug !== slugHomepage) {
		if (doc.parentPage && typeof doc.parentPage === 'object') {
			if (doc.parentPage.parentPage && typeof doc.parentPage.parentPage === 'object') {
				if (
					doc.parentPage.parentPage.parentPage &&
					typeof doc.parentPage.parentPage.parentPage === 'object'
				) {
					if (
						doc.parentPage.parentPage.parentPage.parentPage &&
						typeof doc.parentPage.parentPage.parentPage.parentPage === 'object'
					) {
						link = `/${doc.parentPage.parentPage.parentPage.parentPage.slug}/${doc.parentPage.parentPage.parentPage.slug}/${doc.parentPage.parentPage.slug}/${doc.parentPage.slug}/${doc.slug || ''}`
					} else {
						link = `/${doc.parentPage.parentPage.parentPage.slug}/${doc.parentPage.parentPage.slug}/${doc.parentPage.slug}/${doc.slug || ''}`
					}
				} else {
					link = `/${doc.parentPage.parentPage.slug}/${doc.parentPage.slug}/${doc.slug || ''}`
				}
			} else {
				link = `/${doc.parentPage.slug}/${doc.slug || ''}`
			}
		}

		return `/${doc.slug || ''}`
	}

	return link
}
