import { database } from '../database/database.js';

const users = [];
let nextUserID = 1;

export function getAllUsers() {
    return getAllUsersStatement.all();
}

export function getUserByID(id) {
    return getUserByIDStatement.get(id);
}

export function createUser(userData) {
    return createUserStatement.get(
        userData.name,
        userData.email,
        userData.age
    );
}

export function replaceUser(id, userData) {
    return replaceUserStatement.get(
        userData.name,
        userData.email,
        userData.age,
        id
    )
}

export function updateUser(id, userData) {
    return updateUserStatement.get(
        userData.name ?? null,
        userData.email ?? null,
        userData.age ?? null,
        id
    )
}

export function deleteUser(id) {
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return null;
    }

    const deletedUsers = users.splice(userIndex, 1);
    const deletedUser = deletedUsers[0];

    return deletedUser;
}

const getAllUsersStatement = database.prepare(`
    SELECT id, name, email, age
    FROM users
    ORDER BY id
`);

const createUserStatement = database.prepare(`
    INSERT INTO users (name, email, age)
    VALUES (?, ?, ?)
    RETURNING id, name, email, age
`);

const getUserByIDStatement = database.prepare(`
    SELECT id, name, email, age
    FROM users
    WHERE id = ?
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
`)

const deleteUserStatement = database.prepare(`
    
`)