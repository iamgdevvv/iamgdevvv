import { z } from 'zod'

const ContactSchema = z.object({
	Name: z.string().min(1),
	Email: z.string().email(),
	Organization: z.string().min(1),
	Purposes: z.string().min(1),
	Message: z.string().min(1)
})

type Contact = z.infer<typeof ContactSchema>

export { ContactSchema }
export type { Contact }
