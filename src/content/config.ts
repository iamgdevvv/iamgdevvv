import { defineCollection, z } from 'astro:content'

function removeDupsAndLowerCase(array: string[]) {
	if (!array.length) return array
	const lowercaseItems = array.map((str) => str.toLowerCase())
	const distinctItems = new Set(lowercaseItems)
	return Array.from(distinctItems)
}

const project = defineCollection({
	type: 'content',
	schema: ({ image }) =>
		z.object({
			organization: z.string(),
			link: z.string().url(),
			title: z.string().max(60),
			description: z.string().min(10).max(160),
			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			coverImage: z
				.object({
					src: image(),
					alt: z.string()
				})
				.optional(),
			stacks: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			ogImage: z.string().optional()
		})
})

export const collections = { project }
