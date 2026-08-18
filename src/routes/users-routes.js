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
    const normalizedPath =
        pathname.length > 1 && pathname.endsWith('/')
            ? pathname.slice(0, -1)
            : pathname;

    const urlParts = normalizedPath.split('/');

    const resource = urlParts[1];
    const id = urlParts[2];

    const isUsersCollection =
        normalizedPath === '/users';

    const isUserResource =
        resource === 'users' &&
        id !== undefined &&
        urlParts.length === 3;

    if (req.method === 'GET' && isUsersCollection) {
        const users = getAllUsers();

        sendJSON(res, 200, users);

        return true;
    }

    if (req.method === 'GET' && isUserResource) {
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

    if (req.method === 'PUT' && isUserResource) {
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

    if (req.method === 'PATCH' && isUserResource) {
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

    if (req.method === 'DELETE' && isUserResource) {
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

    if (isUserResource) {
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