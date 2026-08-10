import { UnsupportedMediaTypeError } from "../errors/unsupported-media-type-error.js";
import { PayloadTooLargeError } from '../errors/payload-too-large-error.js';

const JSON_HEADERS = {
    'Content-Type': 'application/json; charset=utf-8',
}

export function validateJSONContentType(req) {
    const contentType = req.headers['content-type'];

    const mediaType = contentType?.split(';')[0].trim().toLowerCase();
    if (mediaType !== 'application/json') {
        throw new UnsupportedMediaTypeError(
            'Content-Type deve ser application/json.'
        );
    }
}
export function sendJSON(res, statusCode, data, headers = {}) {


    res.writeHead(statusCode, {
        ...JSON_HEADERS,
        ...headers,
    });
    return res.end(JSON.stringify(data));
}

export async function readJSONBody(req) {
    let body = '';
    let bodySize = 0;

    const MAX_BODY_SIZE = 100 * 1024;

    for await (const chunk of req) {
        bodySize += chunk.length;

        if(bodySize > MAX_BODY_SIZE) throw new PayloadTooLargeError('O corpo da requisição passa de 100KB.');

        body += chunk.toString();
    }

    if (!body.trim()) {
        throw new SyntaxError('O body não pode estar vazio.')
    }

    try {
        return JSON.parse(body);
    } catch {
        throw new SyntaxError('JSON inválido.')
    }
}