import type { Page, Portofolio, Post, PostCategory, Reusable } from '$payload-types'

export type Queried =
	| {
			collection: 'pages'
			data: Page
	  }
	| {
			collection: 'posts'
			data: Post
	  }
	| {
			collection: 'postCategories'
			data: PostCategory
	  }
	| {
			collection: 'portofolios'
			data: Portofolio
	  }
	| {
			collection: 'reusables'
			data: Reusable
	  }
