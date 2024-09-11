import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return { user: null };
	} else {
		return { user: locals.user };
	}
};
