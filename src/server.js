import http from 'node:http';
import { handleRequest } from './app.js';
import { startRateLimiterCleanup } from './utils/rate-limiter.js';

const PORT = process.env.PORT ?? 3000;

const server = http.createServer(handleRequest);

server.listen(PORT, '0.0.0.0', () => {
    startRateLimiterCleanup();

    console.log(`Servidor rodando na porta ${PORT}`);
});