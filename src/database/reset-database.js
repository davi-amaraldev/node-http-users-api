import { database } from './database.js';

const DATABASE_RESET_INTERVAL = 5 * 60_000;

export function resetDatabase() {
    database.exec('BEGIN');

    try {
        database.exec(`
            DELETE FROM users;

            DELETE FROM sqlite_sequence
            WHERE name = 'users';

            INSERT INTO users (name, email, age)
            VALUES (
                'Portfolio Demo',
                'portfolio@example.com',
                20
            );
        `);

        database.exec('COMMIT');
    } catch (error) {
        database.exec('ROLLBACK');

        throw error;
    }
}

export function startDatabaseReset() {
    return setInterval(() => {
        try {
            resetDatabase();
        } catch (error) {
            console.error(
                'Failed to reset database:',
                error
            );
        }
    }, DATABASE_RESET_INTERVAL);
}
