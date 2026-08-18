import { DatabaseSync } from 'node:sqlite';

const databasePath =
    process.env.NODE_ENV === 'test'
        ? ':memory:'
        : new URL('../../data/database.sqlite', import.meta.url);

export const database = new DatabaseSync(databasePath);

database.exec(` 
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        age INTEGER NOT NULL
    ) STRICT;
`);