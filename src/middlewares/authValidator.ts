import { Request, ResponseToolkit, Server } from '@hapi/hapi';
import jwt from 'jsonwebtoken';

const secret = 'JWT_SECRET';

export const authValidator = (server: Server) => {
    server.ext('onPreAuth', (request: Request, h: ResponseToolkit) => {
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            return h.response({ error: 'Unauthorized' }).code(401).takeover();
        }

        try {
            jwt.verify(token, secret);
            return h.continue;
        } catch (err) {
            return h.response({ error: 'Unauthorized' }).code(401).takeover();
        }
    });
};
