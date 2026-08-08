import { database } from '../database/database.js';
import { ConflictError } from '../errors/conflict-error.js';

function handleDatabaseError(error) {
    if (error.errcode === 2067) {
        throw new ConflictError('Email já cadastrado.');
    }

    throw error;
}

const getAllUsersStatement = database.prepare(`
    SELECT id, name, email, age
    FROM users
    ORDER BY id
`);

const getUserByIDStatement = database.prepare(`
    SELECT id, name, email, age
    FROM users
    WHERE id = ?
`);

const createUserStatement = database.prepare(`
    INSERT INTO users (name, email, age)
    VALUES (?, ?, ?)
    RETURNING id, name, email, age
`);

const replaceUserStatement = database.prepare(`
    UPDATE users
    SET name = ?, email = ?, age = ?
    WHERE id = ?
    RETURNING id, name, email, age
`);

const updateUserStatement = database.prepare(`
    UPDATE users
    SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        age = COALESCE(?, age)
    WHERE id = ?
    RETURNING id, name, email, age
`);

const deleteUserStatement = database.prepare(`
    DELETE FROM users
    WHERE id = ?
    RETURNING id, name, email, age
`);

export function getAllUsers() {
    return getAllUsersStatement.all();
}

export function getUserByID(id) {
    return getUserByIDStatement.get(id);
}

export function createUser(userData) {
    try {
        return createUserStatement.get(
            userData.name,
            userData.email,
            userData.age
        );
    } catch (error) {
        handleDatabaseError(error);
    }
}

export function replaceUser(id, userData) {
    try {
        return replaceUserStatement.get(
            userData.name,
            userData.email,
            userData.age,
            id
        );
    } catch (error) {
        handleDatabaseError(error);
    }
}

export function updateUser(id, userData) {
    try {
        return updateUserStatement.get(
            userData.name ?? null,
            userData.email ?? null,
            userData.age ?? null,
            id
        );
    } catch (error) {
        handleDatabaseError(error);
    }
}

export function deleteUser(id) {
    return deleteUserStatement.get(id);
}