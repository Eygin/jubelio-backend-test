import Hapi from '@hapi/hapi';
import bcrypt from 'bcrypt';
import Joi from '@hapi/joi';
import { createUser, findUserByEmail } from '../models/UsersModels';
import jwt from 'jsonwebtoken';

const saltRounds = 10;
const secret = 'JWT_SECRET';

export const register = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
        const { name, email, password } = request.payload as any;
    
        const schema = Joi.object({
            name: Joi.string().min(3).max(100).required(),
            email: Joi.string().email().min(3).max(100).required(),
            password: Joi.string().min(6).required()
        });
    
        const { error } = schema.validate({name, email, password});

        if (error)
        {
            return h.response({ error: error.details[0].message }).code(400);
        }
    
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await createUser({name, email, password: hashedPassword});
    
        return h.response({ message: 'User registered successfully' }).code(201);
    } catch (err) {
        const error = err as Error;
        // Log the error to the console
        console.error('Error:', error);

        return h.response({
            statusCode: 500,
            error: 'Internal Server Error',
            message: error.message,
        }).code(500);
    }
    
}

export const login = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { email, password } = request.payload as any;
    
    const schema = Joi.object({
        email: Joi.string().email().min(3).max(50).required(),
        password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate({ email, password });
    if (error) {
        return h.response({ error: error.details[0].message }).code(400);
    }

    const user = await findUserByEmail(email);
    if (!user) {
        return h.response({ error: 'User not found' }).code(401);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return h.response({ error: 'Invalid credentials' }).code(401);
    }

    const token = jwt.sign({ id: user.id, username: user.email }, secret, { expiresIn: '6h' });

    return h.response({ token }).code(200);
}