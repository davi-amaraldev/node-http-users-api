import http from 'node:http';
import { sendJSON, readJSONBody } from './utils/http.js';
import {
    createUser,
    getAllUsers,
    getUserByID,
    replaceUser,
    updateUser,
    deleteUser,
} from './repositories/user-repository.js';
import {
    validateCreateUser,
    validateUpdateUser,
    validateUserID,
} from './validators/user-validator.js';

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    console.log(req.method, req.url);

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    const urlParts = pathname.split('/');
    const resource = urlParts[1];
    const id = urlParts[2];

    const isUsersCollection =
        pathname === '/users' || pathname === '/users/';

    if (req.method === 'GET' && pathname === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });

        return res.end('<h1>Página inicial</h1>');
    }

    if (req.method === 'GET' && isUsersCollection) {
        const users = getAllUsers();
        return sendJSON(res, 200, users);
    }

    if (req.method === 'GET' && resource === 'users' && id) {
        let numericId;

        try {
            numericId = validateUserID(id);
        } catch (error) {
            return sendJSON(res, 400, {
                code: 400,
                msg: error.message
            })
        }
        const foundUser = getUserByID(numericId);

        if (!foundUser) {
            return sendJSON(res, 404, {
                code: 404,
                msg: 'Not Found'
            });
        }

        return sendJSON(res, 200, foundUser);
    }

    if (
        req.method === 'POST' &&
        isUsersCollection
    ) {
        try {
            const receivedUser = await readJSONBody(req);

            validateCreateUser(receivedUser);

            const newUser = createUser(receivedUser);

            return sendJSON(res, 201, newUser)
        } catch (error) {
            return sendJSON(res, 400, {
                code: 400,
                msg: error.message
            });
        }
    }

    if (req.method === 'PUT' && resource === 'users' && id) {
        try {
            const numericId = validateUserID(id);
            const receivedUser = await readJSONBody(req);

            validateCreateUser(receivedUser);
            const updatedUser = replaceUser(numericId, receivedUser);

            if (!updatedUser) {
                return sendJSON(res, 404, {
                    code: 404,
                    msg: 'Not Found'
                });
            }

            return sendJSON(res, 200, updatedUser);
        } catch (error) {
            return sendJSON(res, 400, {
                code: 400,
                msg: error.message
            });
        }
    }

    if (req.method === 'PATCH' && resource === 'users' && id) {
        try {
            const numericId = validateUserID(id);
            const receivedUser = await readJSONBody(req);

            validateUpdateUser(receivedUser);

            const updatedUser = updateUser(numericId, receivedUser);

            if (!updatedUser) {
                return sendJSON(res, 404, {
                    code: 404,
                    msg: 'Usuário não encontrado',
                });
            }

            return sendJSON(res, 200, updatedUser);
        } catch (error) {
            return sendJSON(res, 400, {
                code: 400,
                msg: error.message
            });
        }
    }

    if (req.method === 'DELETE' && resource === 'users' && id) {
        try {
            const numericId = validateUserID(id);
            const deletedUser = deleteUser(numericId);

            if (!deletedUser) {
                return sendJSON(res, 404, {
                    code: 404,
                    msg: 'Usuário não encontrado',
                });
            }

            return sendJSON(res, 200, {
                msg: 'Usuário removido',
                user: deletedUser,
            });
        } catch (error) {
            return sendJSON(res, 400, {
                code: 400,
                msg: error.message,
            });
        }
    }

    return sendJSON(res, 404, {
        code: 404,
        msg: 'Not Found',
    });
});

server.listen(PORT, 'localhost', () => {
    console.log(`Servidor local rodando em http://localhost:${PORT}`);
})