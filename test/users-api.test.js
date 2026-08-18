import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';

import { handleRequest } from '../src/app.js';

let server;
let baseURL;

before(async () => {
    server = http.createServer(handleRequest);


    server.listen(0, '127.0.0.1');

    await once(server, 'listening');

    const address = server.address();

    baseURL = `http://127.0.0.1:${address.port}`;
});

after(async () => {
    await new Promise((resolve) => {
        server.close(resolve);
    })
})

describe('Users API', () => {
    it('deve responder a rota principal', async () => {
        const response = await fetch(`${baseURL}/`);

        assert.equal(response.status, 200);
    });

    it('deve retornar 404 para rota inexistente', async () => {
        const response = await fetch(`${baseURL}/banana`);
        const body = await response.json();

        assert.equal(response.status, 404);

        assert.deepEqual(body, {
            code: 404,
            msg: 'Not Found',
        });
    });

    it('deve criar e buscar um usuário', async () => {
        const createResponse = await fetch(`${baseURL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Davi',
                email: 'davi@test.com',
                age: 18,
            }),
        });

        assert.equal(createResponse.status, 201);

        const createdUser = await createResponse.json();

        assert.equal(createdUser.name, 'Davi');
        assert.equal(createdUser.email, 'davi@test.com');
        assert.equal(createdUser.age, 18);

        const getResponse = await fetch(
            `${baseURL}/users/${createdUser.id}`
        );

        assert.equal(getResponse.status, 200);

        const foundUser = await getResponse.json();

        assert.deepEqual(foundUser, createdUser);
    });

    it('deve atualizar e remover um usuário', async () => {
        const createResponse = await fetch(`${baseURL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Usuário Teste',
                email: 'update@test.com',
                age: 20,
            }),
        });

        const createdUser = await createResponse.json();

        const patchResponse = await fetch(
            `${baseURL}/users/${createdUser.id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'Usuário Atualizado',
                }),
            }
        );

        assert.equal(patchResponse.status, 200);

        const updatedUser = await patchResponse.json();

        assert.equal(updatedUser.name, 'Usuário Atualizado');
        assert.equal(updatedUser.email, 'update@test.com');

        const deleteResponse = await fetch(
            `${baseURL}/users/${createdUser.id}`,
            {
                method: 'DELETE',
            }
        );

        assert.equal(deleteResponse.status, 200);

        const getResponse = await fetch(
            `${baseURL}/users/${createdUser.id}`
        );

        assert.equal(getResponse.status, 404);
    });

    it('deve retornar 400 para ID inválido', async () => {
        const response = await fetch(`${baseURL}/users/abc`);

        assert.equal(response.status, 400);
    });

    it('deve retornar 405 para método não permitido', async () => {
        const response = await fetch(`${baseURL}/users`, {
            method: 'DELETE',
        });

        assert.equal(response.status, 405);
        assert.equal(response.headers.get('allow'), 'GET, POST');
    });

    it('deve retornar 415 para Content-Type inválido', async () => {
        const response = await fetch(`${baseURL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({
                name: 'Teste',
                email: 'teste415@example.com',
                age: 20,
            }),
        });

        assert.equal(response.status, 415);
    });

    it('deve retornar 409 para email duplicado', async () => {
        const user = {
            name: 'Duplicado',
            email: 'duplicate@test.com',
            age: 20,
        };

        await fetch(`${baseURL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        const response = await fetch(`${baseURL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        assert.equal(response.status, 409);
    });

    it('deve responder ao preflight de CORS', async () => {
        const response = await fetch(`${baseURL}/users`, {
            method: 'OPTIONS',
            headers: {
                Origin: 'http://localhost:4321',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type',
            },
        });

        assert.equal(response.status, 204);

        assert.equal(
            response.headers.get('access-control-allow-origin'),
            '*'
        );

        assert.equal(
            response.headers.get('access-control-allow-methods'),
            'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        );

        assert.equal(
            response.headers.get('access-control-allow-headers'),
            'Content-Type'
        );
    });

    it('deve retornar 404 para rota de usuário com segmentos extras', async () => {
        const response = await fetch(
            `${baseURL}/users/1/qualquer-coisa`
        );

        assert.equal(response.status, 404);
    });
});
