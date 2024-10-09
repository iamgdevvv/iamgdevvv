import type { APIContext } from 'astro'

export const prerender = false

export async function POST({ request, clientAddress }: APIContext) {
	const data = await request.json()

	const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: `secret=${import.meta.env.GOOGLE_RECAPTCHA_SECREET}&response=${data.recaptcha}&remoteip=${request.headers.get('x-forwarded-for') || clientAddress}`
	})

	const responseData = await response.json()

	return new Response(JSON.stringify(responseData), { status: 200 })
}
