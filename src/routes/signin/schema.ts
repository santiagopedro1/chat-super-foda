import { z } from 'zod';

export const formSchema = z.object({
	username: z
		.string()
		.min(3)
		.max(50)
		.regex(/^[a-zA-Z0-9_-]+$/),
	password: z.string().min(6).max(50)
});

export type FormSchema = typeof formSchema;
