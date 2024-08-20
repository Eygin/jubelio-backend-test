"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const logger = (server) => {
    server.ext('onRequest', (request, h) => {
        console.log(`${request.method.toUpperCase()} ${request.path}`);
        return h.continue;
    });
};
exports.logger = logger;
