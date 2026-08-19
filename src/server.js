import http from 'node:http';
import { handleRequest } from './app.js';
import { startRateLimiterCleanup } from './utils/rate-limiter.js';
import { startDatabaseReset } from './database/reset-database.js';

const PORT = process.env.PORT ?? 3000;

const server = http.createServer(handleRequest);

server.listen(PORT, '0.0.0.0', () => {
    startRateLimiterCleanup();
    startDatabaseReset();

    console.log(`Servidor rodando na porta ${PORT}`);
});