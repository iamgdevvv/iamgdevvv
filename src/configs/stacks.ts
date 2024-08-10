type Stack = {
	name: string
	description: string
	href: string
	iconPath: string
	iconBgColour: string
}

const languages = [
	{
		name: 'Javascript',
		description: 'Love and Hate Relationship',
		href: '#',
		iconPath: 'javascript',
		iconBgColour: '#f7df1e'
	},
	{
		name: 'Typescript',
		description: 'Perfect Javascript with Types',
		href: 'https://www.typescriptlang.org',
		iconPath: 'typescript',
		iconBgColour: '#007acc'
	},
	{
		name: 'PHP',
		description: 'Due to Job Demands',
		href: 'https://www.php.net',
		iconPath: 'php',
		iconBgColour: '#7a86b8'
	}
]

const frontends = [
	{
		name: 'React',
		description: 'Love the Community',
		href: 'https://react.dev',
		iconPath: 'react',
		iconBgColour: '#00d8ff'
	},
	{
		name: 'Vue',
		description: 'Love the Options API',
		href: 'https://vuejs.org',
		iconPath: 'vue',
		iconBgColour: '#41b883'
	},
	{
		name: 'Svelte',
		description: 'Runes Changes Everything',
		href: 'https://svelte.dev',
		iconPath: 'svelte',
		iconBgColour: '#ff3E00'
	},
	{
		name: 'Next.js',
		description: 'Another Job Demands',
		href: 'https://nextjs.org',
		iconPath: 'nextjs',
		iconBgColour: '#000000'
	},
	{
		name: 'Astro',
		description: 'Who Doubts Astro Island',
		href: 'https://astro.build',
		iconPath: 'astro',
		iconBgColour: '#ff5d01'
	}
]

const backends = [
	{
		name: 'Node.js',
		description: 'Wait till Bun Stable',
		href: 'https://nodejs.org',
		iconPath: 'node',
		iconBgColour: '#3e863d'
	},
	{
		name: 'Fastify',
		description: 'Like Express but Faster',
		href: 'https://fastify.dev',
		iconPath: 'fastify',
		iconBgColour: '#000000'
	},
	{
		name: 'Express',
		description: 'Legacy Project Only',
		href: 'https://expressjs.com',
		iconPath: 'express',
		iconBgColour: '#000000'
	},
	{
		name: 'Prisma',
		description: 'Easiest ORM Ever',
		href: 'https://www.prisma.io',
		iconPath: 'prisma',
		iconBgColour: '#0c344b'
	}
]

const others = [
	{
		name: 'Wordpress',
		description: 'Another Job Demands',
		href: 'https://wordpress.org/',
		iconPath: 'wordpress',
		iconBgColour: '#3858e9'
	},
	{
		name: 'Shopify',
		description: 'Another Job Demands',
		href: 'https://www.shopify.com',
		iconPath: 'shopify',
		iconBgColour: '#3e863d'
	},
	{
		name: 'TailwindCSS',
		description: 'Overated but People Champion',
		href: 'https://tailwindcss.com',
		iconPath: 'tailwind',
		iconBgColour: '#3e863d'
	},
	{
		name: 'UnoCSS',
		description: 'Underated but Powerful',
		href: 'https://unocss.dev',
		iconPath: 'uno',
		iconBgColour: '#4d4d4d'
	}
]

export { languages, frontends, backends, others }
export type { Stack }
