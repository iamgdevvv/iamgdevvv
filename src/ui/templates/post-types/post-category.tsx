import ListingPost from '$blocks/listing-post/server'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import type { SiteTemplateProps } from '$templates/site'

type Props = SiteTemplateProps & {
	collection: 'postCategories'
}

export default function PostCategoryTemplate({ data, site, profile }: Props) {
	return (
		<div className="site">
			<Header
				site={site}
				profile={profile}
			/>
			<main className="site-main pt-12 md:pt-16 pb-20 md:pb-32">
				<ListingPost
					block={{
						type: 'selectedCategories',
						selectedCategories: [data.id],
						showFilter: true,
						pagination: 'load-more',
					}}
					withContainer
				/>
			</main>
			<Footer
				site={site}
				profile={profile}
			/>
		</div>
	)
}
