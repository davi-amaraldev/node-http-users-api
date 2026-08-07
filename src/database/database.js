import { DatabaseSync } from 'node:sqlite';

export const database = new DatabaseSync(
    new URL('../../data/database.sqlite', import.meta.url)
);

database.exec(` 
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        age INTEGER NOT NULL
    ) STRICT;
`);