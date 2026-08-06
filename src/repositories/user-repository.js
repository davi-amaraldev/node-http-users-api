const users = [];
let nextUserID = 1;

export function getAllUsers() {
    return users;
}

export function getUserByID(id) {
    return users.find(user => user.id === id);
}

export function createUser(userData) {
    const newUser = {
        id: nextUserID++,
        name: userData.name,
        email: userData.email,
        age: userData.age,
    };

    users.push(newUser);

    return newUser;
}

export function replaceUser(id, userData) {
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return null;
    }

    const updatedUser = {
        id,
        name: userData.name,
        email: userData.email,
        age: userData.age,
    };

    users[userIndex] = updatedUser;

    return updatedUser;
}

export function updateUser(id, userData) {
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return null;
    }

    const updatedUser = {
        ...users[userIndex],
        ...userData,
        id,
    };

    users[userIndex] = updatedUser;

    return updatedUser;
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