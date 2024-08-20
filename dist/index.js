"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hapi_1 = __importDefault(require("@hapi/hapi"));
const jwt_1 = __importDefault(require("@hapi/jwt"));
const api_1 = __importDefault(require("./routes/api"));
const logger_1 = require("./middlewares/logger");
const init = async () => {
    const server = hapi_1.default.server({
        port: 3000,
        host: 'localhost'
    });
    await server.register(jwt_1.default);
    server.auth.strategy('jwt', 'jwt', {
        keys: 'JWT_SECRET',
        verify: {
            aud: false,
            iss: false,
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 21600,
            timeSkewSec: 15
        },
        validate: async (artifacts) => {
            return {
                isValid: true,
                credentials: { user: artifacts.decoded.payload }
            };
        }
    });
    api_1.default.forEach(route => {
        server.route({
            method: route.method,
            path: `/api/v1${route.path}`,
            handler: route.handler,
            options: route.options
        });
    });
    (0, logger_1.logger)(server);
    await server.start();
    console.log('Server running on %s', server.info.uri);
};
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});
init();
