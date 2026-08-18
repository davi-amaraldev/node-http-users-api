import { sendJSON } from './utils/http.js';
import { ConflictError } from './errors/conflict-error.js';
import { UnsupportedMediaTypeError } from './errors/unsupported-media-type-error.js';
import { ValidationError } from './errors/validation-error.js';
import { PayloadTooLargeError } from './errors/payload-too-large-error.js';
import { handleUsersRoutes } from './routes/users-routes.js';

function handleRequestError(res, error) {
    if (error instanceof ValidationError || error instanceof SyntaxError) {
        return sendJSON(res, 400, {
            code: 400,
            msg: error.message,
        });
    }

    if (error instanceof ConflictError) {
        return sendJSON(res, 409, {
            code: 409,
            msg: error.message,
        });
    }

    if (error instanceof UnsupportedMediaTypeError) {
        return sendJSON(res, 415, {
            code: 415,
            msg: error.message,
        });
    }

    if (error instanceof PayloadTooLargeError) {
        return sendJSON(res, 413, {
            code: 413,
            msg: error.message,
        })
    }

    console.error(error);

    return sendJSON(res, 500, {
        code: 500,
        msg: 'Erro interno do servidor.',
    });
}

export async function handleRequest(req, res) {
    console.log(req.method, req.url);

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (req.method === 'GET' && pathname === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
        });

        return res.end('<h1>Página inicial</h1>');
    }

    const usersRouteHandled = await handleUsersRoutes(
        req,
        res,
        pathname,
        handleRequestError
    );

    if (usersRouteHandled) {
        return;
    }

    return sendJSON(res, 404, {
        code: 404,
        msg: 'Not Found',
    });
}

