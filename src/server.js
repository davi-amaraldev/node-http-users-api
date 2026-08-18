import http from 'node:http';
import { handleRequest } from './app.js';

const PORT = 3000;

const server = http.createServer(handleRequest);

server.listen(PORT, 'localhost', () => {
    console.log(`Servidor local rodando em http://localhost:${PORT}`);
});