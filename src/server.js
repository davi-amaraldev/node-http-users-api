import http from 'node:http';
import { sendJSON, readJSONBody } from './utils/http.js';

const PORT = 3000;

function getUserByID(id) {
    return users.find(user => user.id === id);
}

const users = []
let nextUserID = 1;

const server = http.createServer(async (req, res) => {
    console.log(req.method, req.url);

    const urlParts = req.url.split('/');
    const resource = urlParts[1];
    const id = urlParts[2];

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end('<h1>Página inicial</h1>');
    }

    if (req.method === 'GET' && (req.url === '/users' || req.url === '/users/')) {
        return sendJSON(res, 200, users);
    }

    if (req.method === 'GET' && resource === 'users' && id) {
        const numericId = Number(id);
        const foundUser = getUserByID(numericId);

        if (!foundUser) {
            return sendJSON(res, 404, {
                code: 404,
                msg: 'Not Found'
            })
        }

        return sendJSON(res, 200, foundUser);
    }

    if (
        req.method === 'POST' &&
        (req.url === '/users' || req.url === '/users/')
    ) {
        try {
            const receivedUser = await readJSONBody(req);

            const newUser = {
                id: nextUserID++,
                name: receivedUser.name,
                email: receivedUser.email,
                age: receivedUser.age,
            }

            users.push(newUser);

            return sendJSON(res, 201, newUser)
        } catch (error) {
            return sendJSON(res, 400, {
                code: 400,
                msg: error.message
            })
        }
    }

    if (req.method === 'PUT' && resource === 'users' && id) {
        const numericId = Number(id);
        const userIndex = users.findIndex(user => user.id === numericId);

        if (userIndex === -1) {
            return sendJSON(res, 404, {
                code: 404,
                msg: 'Not Found'
            })
        }
        try {
            const receivedUser = await readJSONBody(req)
            const updatedUser = {
                id: numericId,
                name: receivedUser.name,
                email: receivedUser.email,
                age: receivedUser.age,
            }

            users[userIndex] = updatedUser;

            return sendJSON(res, 200, updatedUser);
        } catch (error) {
            return sendJSON(res, 400, {
                code: 400,
                msg: error.message
            })
        }
    }

    if (req.method === 'PATCH' && resource === 'users' && id) {
        const numericId = Number(id);
        const userIndex = users.findIndex(user => user.id === numericId);

        if (userIndex === -1) {
            return sendJSON(res, 404, {
                code: 404,
                msg: 'Not Found'
            })
        }
        try {
            const receivedUser = await readJSONBody(req);
            const updatedUser = {
                ...users[userIndex],
                ...receivedUser,
                id: numericId
            }

            users[userIndex] = updatedUser;

            return sendJSON(res, 200, updatedUser);
        } catch (error) {
            return sendJSON(res, 400, {
                code: 400,
                msg: error.message
            })

        }
    }

    if (req.method === 'DELETE' && resource === 'users' && id) {
        const numericId = Number(id);
        const userIndex = users.findIndex(user => user.id === numericId);

        if (userIndex === -1) {
            return sendJSON(res, 404, {
                msg: "Usuário não encontrado",
            })
        }

        const deletedUsers = users.splice(userIndex, 1);
        const deletedUser = deletedUsers[0];

        return sendJSON(res, 200, {
            msg: 'Usuário removido',
            user: deletedUser,
        })

    }


    return sendJSON(res, 404, {
        code: 404,
        msg: 'Not Found',
    })
})

server.listen(PORT, 'localhost', () => {
    console.log(`Servidor local rodando em http://localhost:${PORT}`);
})