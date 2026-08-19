const clients = new Map();
const MAX_REQUESTS = 10;

export function getClientIp(req) {
    const forwardedFor = req.headers['x-forwarded-for'];

    if (typeof forwardedFor === 'string') {
        return forwardedFor.split(',')[0].trim();
    }

    return req.socket.remoteAddress;
}

export function cleanupExpiredClients() {
    const now = Date.now();

    for (const [ip, client] of clients) {
        if (now >= client.resetAt) {
            clients.delete(ip);
        }
    }
}

export function startRateLimiterCleanup() {
    return setInterval(
        cleanupExpiredClients,
        60_000
    );
}

export function incrementRequestCount(req) {
    const ip = getClientIp(req);

    const client = clients.get(ip);

    const now = Date.now();

    if (!client || now >= client.resetAt) {
        const newClient = {
            count: 1,
            resetAt: now + 60_000,
        };

        clients.set(ip, newClient);

        return {
            ...newClient,
            allowed: true,
        };
    }

    client.count += 1;

    const allowed = client.count <= MAX_REQUESTS;

    return {
        ...client,
        allowed,
    };
}