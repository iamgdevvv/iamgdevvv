import type { Profile, Site, User } from '$payload-types'

import AdminBar from '$layouts/AdminBar'
import Particles from '$layouts/Particles'
import PageTemplate from '$templates/post-types/page'
import PortofolioTemplate from '$templates/post-types/portofolio'
import PostTemplate from '$templates/post-types/post'
import PostCategoryTemplate from '$templates/post-types/post-category'
import ReusableTemplate from '$templates/post-types/reusable'
import LivePreviewListener from '$templates/preview'
import type { Queried } from '$type'

export type SiteTemplateProps = {
	authUser: User | null
	profile: Profile | null
	site: Site | null
	draft?: boolean
} & Queried

export default function SiteTemplate({ draft, ...props }: SiteTemplateProps) {
	return (
		<>
			<AdminBar
				data={props.data}
				collection={props.collection}
				authUser={props.authUser}
			/>
			<Particles />
			{draft ? <LivePreviewListener /> : null}
			{props.collection === 'posts' ? (
				<PostTemplate {...props} />
			) : props.collection === 'postCategories' ? (
				<PostCategoryTemplate {...props} />
			) : props.collection === 'pages' ? (
				<PageTemplate {...props} />
			) : props.collection === 'portofolios' ? (
				<PortofolioTemplate {...props} />
			) : props.collection === 'reusables' ? (
				<ReusableTemplate {...props} />
			) : null}
		</>
	)
}
