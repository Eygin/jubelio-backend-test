import db from "../config/knexfile";

interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
}
 
export const createUser = async (user: User) => {
    const client = await db.connect();
    try {
        const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id';
        const values = [user.name, user.email, user.password];
        const res = await client.query(query, values);
        return res.rows[0].id;
    } catch (err) {
        console.error('Error inserting user:', err);
        throw err;
    } finally {
        client.release();
    }
};

export const findUserByEmail = async (email: string) => {
    const client = await db.connect();
    const result = await client.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    return result.rows[0];
}