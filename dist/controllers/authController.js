"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("@hapi/joi"));
const UsersModels_1 = require("../models/UsersModels");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const saltRounds = 10;
const secret = 'JWT_SECRET';
const register = async (request, h) => {
    try {
        const { name, email, password } = request.payload;
        const schema = joi_1.default.object({
            name: joi_1.default.string().min(3).max(100).required(),
            email: joi_1.default.string().email().min(3).max(100).required(),
            password: joi_1.default.string().min(6).required()
        });
        const { error } = schema.validate({ name, email, password });
        if (error) {
            return h.response({ error: error.details[0].message }).code(400);
        }
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        await (0, UsersModels_1.createUser)({ name, email, password: hashedPassword });
        return h.response({ message: 'User registered successfully' }).code(201);
    }
    catch (err) {
        const error = err;
        // Log the error to the console
        console.error('Error:', error);
        return h.response({
            statusCode: 500,
            error: 'Internal Server Error',
            message: error.message,
        }).code(500);
    }
};
exports.register = register;
const login = async (request, h) => {
    const { email, password } = request.payload;
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().min(3).max(50).required(),
        password: joi_1.default.string().min(6).required(),
    });
    const { error } = schema.validate({ email, password });
    if (error) {
        return h.response({ error: error.details[0].message }).code(400);
    }
    const user = await (0, UsersModels_1.findUserByEmail)(email);
    if (!user) {
        return h.response({ error: 'User not found' }).code(401);
    }
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match) {
        return h.response({ error: 'Invalid credentials' }).code(401);
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.email }, secret, { expiresIn: '6h' });
    return h.response({ 'token': token }).code(200);
};
exports.login = login;
const getUser = async (request, h) => {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
        return h.response({ error: 'Unauthorized' }).code(401).takeover();
    }
    try {
        jsonwebtoken_1.default.verify(token, secret);
        return h.response({ 'token': token }).code(200);
    }
    catch (err) {
        return h.response({ error: 'Unauthorized' }).code(401).takeover();
    }
};
exports.getUser = getUser;
