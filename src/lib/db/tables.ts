import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const userTable = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	password_hash: text('password_hash').notNull()
});

export const sessionTable = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer('expires_at').notNull()
});

export const messageTable = sqliteTable('message', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	content: text('content').notNull(),
	timestamp: integer('timestamp', { mode: 'timestamp' }).notNull()
});
