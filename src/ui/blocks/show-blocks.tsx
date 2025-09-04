import type { HTMLAttributes } from 'react'

import Actions from '$blocks/actions'
import BaseContent from '$blocks/base-content'
import Button from '$blocks/button'
import CardForm from '$blocks/card-form'
import CollapsibleTab from '$blocks/collapsible-tab'
import ContentMedia from '$blocks/content-media'
import Divider from '$blocks/divider'
import Gallery from '$blocks/gallery'
import HeadingCertification from '$blocks/heading-certification/server'
import HeadingContent from '$blocks/heading-content'
import HeadingExperience from '$blocks/heading-experience/server'
import HeadingPortofolio from '$blocks/heading-portofolio/server'
import HeadingPost from '$blocks/heading-post/server'
import HeadingTool from '$blocks/heading-tool/server'
import ListingCertification from '$blocks/listing-certification/server'
import ListingExperience from '$blocks/listing-experience/server'
import ListingPortofolio from '$blocks/listing-portofolio/server'
import ListingPostCategory from '$blocks/listing-post-category/server'
import ListingPost from '$blocks/listing-post/server'
import ListingTool from '$blocks/listing-tool/server'
import Media from '$blocks/media'
import ProfileShowcase from '$blocks/profile-showcase'
import ShowReusable from '$blocks/show-reusable'
import Spacing from '$blocks/spacing'
import type { Config, Profile, Site } from '$payload-types'
import type { Queried } from '$type'

export type ShowBlocksProps = HTMLAttributes<HTMLDivElement> & {
	block?: Config['blocks'][keyof Config['blocks']][] | null
	profile?: Profile | null
	site?: Site | null
	queried?: Queried
	withContainer?: boolean
}

export default function ShowBlocks({
	block,
	profile,
	queried,
	withContainer = true,
	...props
}: ShowBlocksProps) {
	if (!block) {
		return null
	}

	return block.map((block, index) => {
		const keyComp = `${block.blockType}-${block.id || index}`

		if (block.blockType === 'actions') {
			return (
				<Actions
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'baseContent') {
			return (
				<BaseContent
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'button') {
			return (
				<Button
					key={keyComp}
					block={block}
				/>
			)
		}

		if (block.blockType === 'cardForm') {
			return (
				<CardForm
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'collapsibleTab') {
			return (
				<CollapsibleTab
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'contentMedia') {
			return (
				<ContentMedia
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'divider') {
			return (
				<Divider
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'gallery') {
			return (
				<Gallery
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'headingContent') {
			return (
				<HeadingContent
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'headingCertification') {
			return (
				<HeadingCertification
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'headingExperience') {
			return (
				<HeadingExperience
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'headingPortofolio') {
			return (
				<HeadingPortofolio
					key={keyComp}
					block={block}
					queried={queried?.collection === 'portofolios' ? queried.data : undefined}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'headingPost') {
			return (
				<HeadingPost
					key={keyComp}
					block={block}
					queried={queried?.collection === 'posts' ? queried.data : undefined}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'headingTool') {
			return (
				<HeadingTool
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'listingCertification') {
			return (
				<ListingCertification
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'listingExperience') {
			return (
				<ListingExperience
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'listingPortofolio') {
			return (
				<ListingPortofolio
					key={keyComp}
					block={block}
					queried={queried?.collection === 'portofolios' ? queried.data : undefined}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'listingPost') {
			return (
				<ListingPost
					key={keyComp}
					block={block}
					withContainer={withContainer}
					queried={queried?.collection === 'posts' ? queried.data : undefined}
					{...props}
				/>
			)
		}

		if (block.blockType === 'listingPostCategory') {
			return (
				<ListingPostCategory
					key={keyComp}
					block={block}
					withContainer={withContainer}
					queried={queried?.collection === 'postCategories' ? queried.data : undefined}
					{...props}
				/>
			)
		}

		if (block.blockType === 'listingTool') {
			return (
				<ListingTool
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'media') {
			return (
				<Media
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'profileShowcase') {
			return (
				<ProfileShowcase
					key={keyComp}
					block={block}
					profile={profile}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'showReusable') {
			return (
				<ShowReusable
					key={keyComp}
					block={block}
					withContainer={withContainer}
					{...props}
				/>
			)
		}

		if (block.blockType === 'spacing') {
			return (
				<Spacing
					key={keyComp}
					block={block}
					{...props}
				/>
			)
		}

		return <pre key={keyComp}>{JSON.stringify(block, null, 2)}</pre>
	})
}
