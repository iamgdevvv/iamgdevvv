import ShowBlocks from '$blocks/show-blocks'
import Footer from '$layouts/Footer'
import Header from '$layouts/Header'
import type { SiteTemplateProps } from '$templates/site'

type Props = SiteTemplateProps & {
	collection: 'reusables'
}

export default function ReusableTemplate({ data, site, profile }: Props) {
	return (
		<div className="site">
			<Header
				site={site}
				profile={profile}
			/>
			<main className="site-main">
				<ShowBlocks
					block={data.content}
					profile={profile}
				/>
			</main>
			<Footer
				site={site}
				profile={profile}
			/>
		</div>
	)
}
