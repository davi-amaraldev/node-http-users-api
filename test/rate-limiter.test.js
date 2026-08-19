import test from 'node:test';
import assert from 'node:assert/strict';
import {
    getClientIp,
    incrementRequestCount,
} from '../src/utils/rate-limiter.js';

test('deve bloquear um cliente após exceder o limite de requisições', () => {
    const req = {
        headers: {
            'x-forwarded-for': '203.0.113.100',
        },
        socket: {
            remoteAddress: '127.0.0.1',
        },
    };

    let result;

    for (let i = 0; i < 10; i++) {
        result = incrementRequestCount(req);

        assert.equal(result.allowed, true);
    }

    result = incrementRequestCount(req);

    assert.equal(result.allowed, false);
    assert.equal(result.count, 11);
});

test('deve obter o IP do cliente pelo X-Forwarded-For', () => {
    const req = {
        headers: {
            'x-forwarded-for': '203.0.113.50',
        },
        socket: {
            remoteAddress: '127.0.0.1',
        },
    };

    const ip = getClientIp(req);

    assert.equal(ip, '203.0.113.50');
});

test('deve usar o endereço do socket quando X-Forwarded-For não existir', () => {
    const req = {
        headers: {},
        socket: {
            remoteAddress: '127.0.0.1',
        },
    };

    const ip = getClientIp(req);

    assert.equal(ip, '127.0.0.1');
});

test('deve usar o primeiro IP quando X-Forwarded-For tiver múltiplos endereços', () => {
    const req = {
        headers: {
            'x-forwarded-for': '203.0.113.50, 172.18.0.2, 10.0.0.1',
        },
        socket: {
            remoteAddress: '127.0.0.1',
        },
    };

    const ip = getClientIp(req);

    assert.equal(ip, '203.0.113.50');
});

test('deve iniciar uma nova janela após o tempo expirar', (t) => {
    t.mock.timers.enable({
        apis: ['Date'],
        now: 1_000,
    });

    const req = {
        headers: {
            'x-forwarded-for': '203.0.113.200',
        },
        socket: {
            remoteAddress: '127.0.0.1',
        },
    };

    let result;

    for (let i = 0; i < 10; i++) {
        result = incrementRequestCount(req);
    }

    assert.equal(result.count, 10);
    assert.equal(result.allowed, true);

    result = incrementRequestCount(req);

    assert.equal(result.count, 11);
    assert.equal(result.allowed, false);

    t.mock.timers.setTime(61_001);

    result = incrementRequestCount(req);

    assert.equal(result.count, 1);
    assert.equal(result.allowed, true);
});