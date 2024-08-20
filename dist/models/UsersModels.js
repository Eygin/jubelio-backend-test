"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = exports.createUser = void 0;
const knexfile_1 = __importDefault(require("../config/knexfile"));
const createUser = async (user) => {
    const client = await knexfile_1.default.connect();
    try {
        const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id';
        const values = [user.name, user.email, user.password];
        const res = await client.query(query, values);
        return res.rows[0].id;
    }
    catch (err) {
        console.error('Error inserting user:', err);
        throw err;
    }
    finally {
        client.release();
    }
};
exports.createUser = createUser;
const findUserByEmail = async (email) => {
    const client = await knexfile_1.default.connect();
    const result = await client.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    return result.rows[0];
};
exports.findUserByEmail = findUserByEmail;
