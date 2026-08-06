const JSON_HEADERS = {
    'Content-Type': 'application/json; charset=utf-8',
}

export function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, JSON_HEADERS);
    return res.end(JSON.stringify(data));
}

export async function readJSONBody(req) {
    let body = '';

    for await (const chunk of req) {
        body += chunk.toString();
    }

    if (!body.trim()) {
        throw new SyntaxError('O body não pode estar vazio.')
    }

    try {
        return JSON.parse(body);
    } catch (error) {
        throw new SyntaxError('JSON inválido.')
    }
}