import { slug404 } from '$modules/vars'
import { generateMeta } from '$payload-libs/meta-utils'
import { getAuthUser, getProfileGlobal, getSiteGlobal } from '$payload-libs/server/repos'
import { seoSchema } from '$seo/index'
import { pageLoader } from '$server-functions/loader'
import SiteTemplate from '$templates/site'

export default async function notFoundPage() {
	const page = await pageLoader([slug404])

	if (!page) {
		return null
	}

	const [authUser, profileConfig, siteConfig] = await Promise.all([
		getAuthUser(),
		getProfileGlobal(),
		getSiteGlobal(),
	])

	const metadata = await generateMeta(page, siteConfig)

	return (
		<>
			<title>
				{typeof metadata.title === 'string' ? metadata.title : `404 | ${siteConfig?.title}`}
			</title>
			<script
				id="organization-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						seoSchema({
							collection: 'pages',
							data: page,
							site: siteConfig,
						}),
					),
				}}
			/>
			<SiteTemplate
				authUser={authUser}
				data={page}
				site={siteConfig}
				profile={profileConfig}
				collection="pages"
			/>
		</>
	)
}
