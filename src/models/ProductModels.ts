import db from "../config/knexfile";

export interface Product {
    id?: number;
    title: string;
    sku: string;
    image: string;
    price: number;
    description: string;
    stock: number;
}
 
export const getList = async (params: object) =>
{
    const client = await db.connect();
    try {
        const {page, limit} = params as any;
        const offset = (page - 1) * limit;
        const result = (await client.query('SELECT title, sku, image, price, stock, id, description FROM products ORDER BY id DESC LIMIT $1 OFFSET $2', [limit, offset])).rows;
        const countResult = await client.query('SELECT COUNT(id) AS count FROM products');

        return {result, countResult}
    } catch (err) {
        console.error('Error inserting user:', err);
        throw err;
    } finally {
        client.release();
    }
}

export const create = async (product: Product) => {
    const client = await db.connect();
    try {
        const insertQuery = `
            INSERT INTO products (title, sku, image, price, description, stock)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const result = await client.query(insertQuery, [product.title, product.sku, product.image, product.price, product.description, product.stock]);
        const newProduct = result.rows[0];

        return newProduct;
    } catch (err) {
        console.error('Error inserting product:', err);
        throw err;
    } finally {
        client.release();
    }
}

export const checkSKU = async (sku: string) => {
    const client = await db.connect();
    try {
        const result = await client.query(`SELECT id, sku, stock, price FROM products WHERE LOWER(sku) = LOWER($1)`, [sku]);
        
        return result.rows[0];
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}

export const detail = async (id: number): Promise<Product | null> => {
    const client = await db.connect();
    try {
        const result = await client.query('SELECT id, title, sku, image, price, description, stock FROM products WHERE id = $1', [id]);
        
        return result.rows[0] || null;
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}

export const update = async (id: number, product: Partial<Product>): Promise<Product> => {
    const client = await db.connect();
    try {
        const result = await client.query(`UPDATE products SET title = COALESCE($1, title), sku = COALESCE($2, sku), image = COALESCE($3, image), price = COALESCE($4, price), description = COALESCE($5, description) WHERE id = $6 RETURNING *
        `, [product.title, product.sku, product.image, product.price, product.description, id]);

        return result.rows[0];
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}

export const deleteById = async (id: number): Promise<Product | null> => {
    const client = await db.connect();

    try {
        const result = await client.query('DELETE FROM products WHERE id = $1', [id]);
        
        return result.rows[0] || null;
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}

export const updateStock = async (id: number, product: Partial<Product>): Promise<Product> => {
    const client = await db.connect();
    try {
        const result = await client.query(`UPDATE products SET stock = COALESCE($1, stock) WHERE id = $2 RETURNING *
        `, [product.stock, id]);

        return result.rows[0];
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}