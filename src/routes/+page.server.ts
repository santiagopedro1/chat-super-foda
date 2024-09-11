import type { PageServerLoad } from './$types';

import { db, userTable } from '$lib/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return { user: null, allUsers: null };
	} else {
		const allUsers = await db
			.select({ id: userTable.id, username: userTable.username })
			.from(userTable)
			.all();
		return { user: locals.user, allUsers };
	}
};
