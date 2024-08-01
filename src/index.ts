import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import apiRoutes from './routes/api';
import { logger } from './middlewares/logger';

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register(Jwt);

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
    
    apiRoutes.forEach(route => {
        server.route({
            method: route.method,
            path: `/api/v1${route.path}`,
            handler: route.handler,
            options: route.options
        });
    });
    
    logger(server);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

init();
