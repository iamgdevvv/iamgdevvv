import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'

/** Note: this function filters out draft entries based on the environment */
export async function getAllProjects() {
	return await getCollection('project')
}

export function sortMDByDate(entries: CollectionEntry<'project'>[] | CollectionEntry<'project'>[]) {
	return entries.sort((a, b) => {
		const aDate = new Date(a.data.publishDate).valueOf()
		const bDate = new Date(b.data.publishDate).valueOf()
		return bDate - aDate
	})
}

/** Note: This function doesn't filter draft entries, pass it the result of getAllProjects above to do so. */
export function getAllStacks(entries: CollectionEntry<'project'>[] | CollectionEntry<'project'>[]) {
	return entries.flatMap((project) => [...project.data.stacks])
}

/** Note: This function doesn't filter draft entries, pass it the result of getAllProjects above to do so. */
export function getUniqueStacks(
	entries: CollectionEntry<'project'>[] | CollectionEntry<'project'>[]
) {
	return [...new Set(getAllStacks(entries))]
}

/** Note: This function doesn't filter draft entries, pass it the result of getAllProjects above to do so. */
export function getUniqueStacksWithCount(
	entries: CollectionEntry<'project'>[]
): Array<[string, number]> {
	return [
		...getAllStacks(entries).reduce(
			(acc, t) => acc.set(t, (acc.get(t) || 0) + 1),
			new Map<string, number>()
		)
	].sort((a, b) => b[1] - a[1])
}
