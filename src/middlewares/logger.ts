import { Request, ResponseToolkit, Server } from '@hapi/hapi';

export const logger = (server: Server) => {
    server.ext('onRequest', (request: Request, h: ResponseToolkit) => {
        console.log(`${request.method.toUpperCase()} ${request.path}`);
        return h.continue;
    });
};
