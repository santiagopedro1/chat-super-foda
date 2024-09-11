import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import * as schema from './tables';

import { DATABASE_URL, DATABASE_AUTH_TOKEN } from '$env/static/private';

const client = createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN });

export const db = drizzle(client, { schema });

export const userTable = schema.userTable;
export const sessionTable = schema.sessionTable;
