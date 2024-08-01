import { Pool } from 'pg';

const config = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Qwebnm123_',
    database: process.env.DB_NAME || 'jubelio_testing',
});

export default config;
