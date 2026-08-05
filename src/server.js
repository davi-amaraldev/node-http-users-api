import http from 'node:http';

const PORT = 3000;

const JSON_HEADERS = {
    'Content-Type': 'application/json; charset=utf-8',
};

function getUserByID(id) {
    return users.find(user => user.id === id);
}

const users = []

const server = http.createServer((req, res) => {
    console.log(req.method, req.url);

    const urlParts = req.url.split('/');
    const resource = urlParts[1];
    const id = urlParts[2];

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

        return res.end('<h1>Página inicial</h1>');
    }

    if (req.method === 'GET' && (req.url === '/users' || req.url === '/users/')) {
        res.writeHead(200, JSON_HEADERS);

        return res.end(JSON.stringify(users));
    }

    if (req.method === 'GET' && resource === 'users' && id) {
        const numericId = Number(id);
        const foundUser = getUserByID(numericId);

        if (!foundUser) {
            res.writeHead(404, JSON_HEADERS);

            return res.end(JSON.stringify({
                code: res.statusCode,
                msg: res.statusMessage
            }))
        }

        res.writeHead(200, JSON_HEADERS);
        return res.end(JSON.stringify(foundUser));
    }

    if (
        req.method === 'POST' &&
        (req.url === '/users' || req.url === '/users/')
    ) {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', () => {
            const receivedUser = JSON.parse(body);

            const newUser = {
                id: users.length + 1,
                name: receivedUser.name,
                email: receivedUser.email,
                age: receivedUser.age,
            }

            users.push(newUser);

            res.writeHead(201, JSON_HEADERS);

            return res.end(JSON.stringify({
                msg: 'Body recebido com sucesso'
            }));
        });

        return;
    }

    if (req.method === 'PUT' && resource === 'users' && id) {
        const numericId = Number(id);
        const userIndex = users.findIndex(user => user.id === numericId);

        if (userIndex === -1) {

            res.writeHead(404, JSON_HEADERS);
            return res.end(JSON.stringify({
                error: 'Usuário não encontrado',
            }))
        }

        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })


        req.on('end', () => {
            const receivedUser = JSON.parse(body);
            const updatedUSer = {
                id: numericId,
                name: receivedUser.name,
                email: receivedUser.email,
                age: receivedUser.age,
            }

            users[userIndex] = updatedUSer;
            console.log('Usuário atualizado: ', users[userIndex]);

            res.writeHead(200, JSON_HEADERS);
            return res.end(JSON.stringify({
                userIndex,
            }));
        })

        return;
    }

    if (req.method === 'PATCH' && resource === 'users' && id) {
        const numericId = Number(id);
        const userIndex = users.findIndex(user => user.id === numericId);

        if (userIndex === -1) {

            res.writeHead(404, JSON_HEADERS);
            return res.end(JSON.stringify({
                error: 'Usuário não encontrado',
            }))
        }

        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })


        req.on('end', () => {
            const receivedUser = JSON.parse(body);
            const updatedUSer = {
                ...users[userIndex],
                ...receivedUser,
                id: numericId
            }

            users[userIndex] = updatedUSer;
            console.log('Usuário atualizado: ', users[userIndex]);

            res.writeHead(200, JSON_HEADERS);
            return res.end(JSON.stringify({
                userIndex,
            }));
        })

        return;
    }

    if(req.method === 'DELETE' && resource === 'users' && id){
        const numericId = Number(id);
        const userIndex = users.findIndex(user => user.id === numericId);

        if(userIndex.id === -1){
            res.writeHead(404, JSON_HEADERS);

            return res.end(JSON.stringify({
                code: res.statusCode,
                error: 'User Not Found',    
            }))
        }

        const deletedUsers = users.splice(userIndex, 1);
        const deletedUser = deletedUsers[0];

        res.writeHead(200, JSON_HEADERS);
        return res.end(JSON.stringify({
            msg: `Usuário removido`,
            user: deletedUser,
        }))

    }


    res.writeHead(404, JSON_HEADERS);
    return res.end(JSON.stringify({
        code: res.statusCode,
        msg: res.statusMessage
    }))
})

server.listen(PORT, 'localhost', () => {
    console.log(`Servidor local rodando em http://localhost:${PORT}`);
})