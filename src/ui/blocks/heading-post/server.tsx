'use server'
import type { Sort } from 'payload'
import type { HTMLAttributes } from 'react'

import type { HeadingPost as HeadingPostBlock, Post } from '$payload-types'
import { type OptionsQueryPosts, queryPosts } from '$server-functions/post'
import HeadingPostClient from './client'

export type HeadingPostProps = {
	block: HeadingPostBlock | Omit<HeadingPostBlock, 'blockType'>
	queried?: Post
	withContainer?: boolean
} & HTMLAttributes<HTMLDivElement>

export type OptionsQueryHeadingPosts = Omit<OptionsQueryPosts, 'whereAnd' | 'whereOr'>

export const queryHeadingPost = async (
	block: HeadingPostProps['block'],
	options?: OptionsQueryHeadingPosts,
) => {
	let sort: Sort | undefined = undefined
	let search: OptionsQueryPosts['search'] = options?.search
	let limit = options?.limit || block.total || 4
	const postIds: number[] = []

	if (options?.sort) {
		sort = options.sort
	} else {
		sort = block.order === 'DESC' ? '-' : ''

		if (block.orderBy === 'title') {
			sort += 'title'
		} else {
			sort += 'publishedAt'
		}
	}

	if (block.type === 'selectedPosts' && block.selectedPosts && !options?.filter?.ids) {
		limit = 100000

		block.selectedPosts.forEach((post) => {
			if (typeof post === 'number') {
				postIds.push(post)
			} else if (typeof post === 'object' && post.id) {
				postIds.push(post.id)
			}
		})

		if (postIds.length === 0) {
			return null
		}
	} else if (block.type === 'search' && block.search && !search) {
		search = block.search
	}

	return await queryPosts({
		...options,
		search,
		limit,
		sort,
		filter: {
			...options?.filter,
			ids: options?.filter?.ids || postIds,
		},
	})
}

export default async function HeadingPost({ block, queried, ...props }: HeadingPostProps) {
	const resultPosts = await queryHeadingPost(block, {
		queried,
	})

	return (
		<HeadingPostClient
			{...props}
			block={block}
			posts={resultPosts?.docs || []}
		/>
	)
}
