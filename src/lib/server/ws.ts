import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import * as schema from '$lib/db/tables';

const client = createClient({
	url: process.env.DATABASE_URL!,
	authToken: process.env.DATABASE_AUTH_TOKEN!
});

const db = drizzle(client, { schema });

const server = Bun.serve({
	port: process.env.PUBLIC_WS_PORT!,

	websocket: {
		async message(ws, message: string) {
			const content = JSON.parse(message);
			switch (content.type) {
				case 'config':
					console.log('Give me the messages bitch');
					const messages = await db
						.select({ userId: schema.messageTable.userId, content: schema.messageTable.content })
						.from(schema.messageTable)
						.orderBy(schema.messageTable.timestamp);

					const allUsers = await db
						.select({ id: schema.userTable.id, username: schema.userTable.username })
						.from(schema.userTable);

					ws.send(
						JSON.stringify({
							type: 'config',
							messages,
							allUsers
						})
					);
					break;

				case 'new message':
					console.log('new message');

					const { userId, content } = JSON.parse(message).data;

					await db.insert(schema.messageTable).values({
						userId,
						content,
						timestamp: new Date()
					});

					ws.send(
						JSON.stringify({
							type: 'status',
							content: 'Message sent!'
						})
					);

					break;
			}
		}
	},
	fetch(req, server) {
		const success = server.upgrade(req);
		if (success) {
			// Bun automatically returns a 101 Switching Protocols
			// if the upgrade succeeds
			return undefined;
		}

		return new Response('Not a websocket connection', { status: 400 });
	}
});

console.log(`Listening on ${server.hostname}:${server.port}`);
