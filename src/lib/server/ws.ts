import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import * as schema from '$lib/db/tables';
import type { ServerWebSocket } from 'bun';

const client = createClient({
	url: process.env.DATABASE_URL!,
	authToken: process.env.DATABASE_AUTH_TOKEN!
});

const db = drizzle(client, { schema });

const server = Bun.serve({
	hostname: process.env.PUBLIC_WS_HOST || 'localhost',
	port: process.env.PUBLIC_WS_PORT || 3000,

	websocket: {
		open(ws) {
			console.log('New connection from ', ws.remoteAddress);
			connections.push(ws);
		  },
		async message(ws, message: string) {
			const content = JSON.parse(message);
			switch (content.type) {
				case 'config':
					console.log('all messages to ', ws.remoteAddress);
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
					console.log('new message from ', ws.remoteAddress);

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

					connections.forEach((connection) => {
						if (connection !== ws && connection.readyState === WebSocket.OPEN) {
						  connection.send(JSON.stringify({ type: 'new message', data: { userId, content } }));
						}
					  });

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

const connections: Array<ServerWebSocket<unknown>> = [];