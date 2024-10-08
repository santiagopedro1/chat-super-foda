import type { RequestHandler } from './$types';

import { lucia } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	if (!event.locals.session) {
		redirect(302, '/');
	}
	await lucia.invalidateSession(event.locals.session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
	redirect(302, '/signin');
};
