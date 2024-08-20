"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = 'JWT_SECRET';
const authValidator = (server) => {
    server.ext('onPreAuth', (request, h) => {
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            return h.response({ error: 'Unauthorized' }).code(401).takeover();
        }
        try {
            jsonwebtoken_1.default.verify(token, secret);
            return h.continue;
        }
        catch (err) {
            return h.response({ error: 'Unauthorized' }).code(401).takeover();
        }
    });
};
exports.authValidator = authValidator;
