import rss from '@astrojs/rss'
import { siteConfig } from '@/configs/site'
import { getAllProjects } from '@/utils'

export const GET = async () => {
	const projects = await getAllProjects()

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: import.meta.env.SITE,
		items: projects.map((project) => ({
			title: project.data.title,
			description: project.data.description,
			pubDate: project.data.publishDate,
			link: `/projects/${project.slug}`
		}))
	})
}
