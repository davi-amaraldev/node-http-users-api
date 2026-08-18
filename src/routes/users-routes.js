import {
    sendJSON,
    readJSONBody,
    validateJSONContentType
} from "../utils/http.js";
import {
    getAllUsers,
    getUserByID,
    createUser,
    replaceUser,
    updateUser,
    deleteUser,
} from "../repositories/user-repository.js";
import {
    validateUserID,
    validateCreateUser,
    validateUpdateUser
} from "../validators/user-validator.js";

export async function handleUsersRoutes(
    req,
    res,
    pathname,
    handleRequestError,
) {
    const isUsersCollection =
        pathname === '/users' || pathname === '/users/';

    const urlParts = pathname.split('/');
    const resource = urlParts[1];
    const id = urlParts[2];

    if (req.method === 'GET' && isUsersCollection) {
        const users = getAllUsers();

        sendJSON(res, 200, users);

        return true;
    }

    if (req.method === 'GET' && resource === 'users' && id) {
        let numericId;

        try {
            numericId = validateUserID(id);
        } catch (error) {
            handleRequestError(res, error);
            return true;
        }
        const foundUser = getUserByID(numericId);

        if (!foundUser) {
            sendJSON(res, 404, {
                code: 404,
                msg: 'Not Found'
            });

            return true;
        }

        sendJSON(res, 200, foundUser);
        return true;
    }

    if (
        req.method === 'POST' &&
        isUsersCollection
    ) {
        try {
            validateJSONContentType(req);

            const receivedUser = await readJSONBody(req);

            validateCreateUser(receivedUser);

            const newUser = createUser(receivedUser);

            sendJSON(res, 201, newUser);

            return true;
        } catch (error) {
            handleRequestError(res, error);

            return true;
        }
    }

    if (req.method === 'PUT' && resource === 'users' && id) {
        try {
            validateJSONContentType(req);

            const numericId = validateUserID(id);
            const receivedUser = await readJSONBody(req);

            validateCreateUser(receivedUser);
            const updatedUser = replaceUser(numericId, receivedUser);

            if (!updatedUser) {
                sendJSON(res, 404, {
                    code: 404,
                    msg: 'Not Found'
                });
                return true;
            }

            sendJSON(res, 200, updatedUser);
            return true;
        } catch (error) {
            handleRequestError(res, error);
            return true;
        }
    }

    if (req.method === 'PATCH' && resource === 'users' && id) {
        try {
            validateJSONContentType(req);

            const numericId = validateUserID(id);
            const receivedUser = await readJSONBody(req);

            validateUpdateUser(receivedUser);

            const updatedUser = updateUser(numericId, receivedUser);

            if (!updatedUser) {
                sendJSON(res, 404, {
                    code: 404,
                    msg: 'Usuário não encontrado',
                });
                return true;
            }

            sendJSON(res, 200, updatedUser);
            return true;
        } catch (error) {
            handleRequestError(res, error);
            return true;
        }
    }

    if (req.method === 'DELETE' && resource === 'users' && id) {
        try {
            const numericId = validateUserID(id);
            const deletedUser = deleteUser(numericId);

            if (!deletedUser) {
                sendJSON(res, 404, {
                    code: 404,
                    msg: 'Usuário não encontrado',
                });
                return true;
            }

            sendJSON(res, 200, {
                msg: 'Usuário removido',
                user: deletedUser,
            });
            return true;
        } catch (error) {
            handleRequestError(res, error);
            return true;
        }
    }


    if (isUsersCollection) {
        sendJSON(
            res,
            405,
            {
                code: 405,
                msg: 'Method Not Allowed',
            },
            {
                Allow: 'GET, POST',
            }
        );

        return true;
    }

    if (resource === 'users' && id) {
        sendJSON(
            res,
            405,
            {
                code: 405,
                msg: 'Method Not Allowed',
            },
            {
                Allow: 'GET, PUT, PATCH, DELETE',
            }
        );

        return true;
    }

    return false;
}