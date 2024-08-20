"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStock = exports.deleteById = exports.update = exports.detail = exports.checkSKU = exports.create = exports.getList = void 0;
const knexfile_1 = __importDefault(require("../config/knexfile"));
const getList = async (params) => {
    const client = await knexfile_1.default.connect();
    try {
        const { page, limit } = params;
        const offset = (page - 1) * limit;
        const result = (await client.query('SELECT title, sku, image, price FROM products LIMIT $1 OFFSET $2', [limit, offset])).rows;
        const countResult = await client.query('SELECT COUNT(id) AS count FROM products');
        return { result, countResult };
    }
    catch (err) {
        console.error('Error inserting user:', err);
        throw err;
    }
    finally {
        client.release();
    }
};
exports.getList = getList;
const create = async (product) => {
    const client = await knexfile_1.default.connect();
    try {
        const insertQuery = `
            INSERT INTO products (title, sku, image, price, description, stock)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const result = await client.query(insertQuery, [product.title, product.sku, product.image, product.price, product.description, product.stock]);
        const newProduct = result.rows[0];
        return newProduct;
    }
    catch (err) {
        console.error('Error inserting product:', err);
        throw err;
    }
    finally {
        client.release();
    }
};
exports.create = create;
const checkSKU = async (sku) => {
    const client = await knexfile_1.default.connect();
    try {
        const result = await client.query(`SELECT id, sku, stock, price FROM products WHERE LOWER(sku) = LOWER($1)`, [sku]);
        return result.rows[0];
    }
    catch (err) {
        throw err;
    }
    finally {
        client.release();
    }
};
exports.checkSKU = checkSKU;
const detail = async (id) => {
    const client = await knexfile_1.default.connect();
    try {
        const result = await client.query('SELECT id, title, sku, image, price, description, stock FROM products WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    catch (err) {
        throw err;
    }
    finally {
        client.release();
    }
};
exports.detail = detail;
const update = async (id, product) => {
    const client = await knexfile_1.default.connect();
    try {
        const result = await client.query(`UPDATE products SET title = COALESCE($1, title), sku = COALESCE($2, sku), image = COALESCE($3, image), price = COALESCE($4, price), description = COALESCE($5, description) WHERE id = $6 RETURNING *
        `, [product.title, product.sku, product.image, product.price, product.description, id]);
        return result.rows[0];
    }
    catch (err) {
        throw err;
    }
    finally {
        client.release();
    }
};
exports.update = update;
const deleteById = async (id) => {
    const client = await knexfile_1.default.connect();
    try {
        const result = await client.query('DELETE FROM products WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    catch (err) {
        throw err;
    }
    finally {
        client.release();
    }
};
exports.deleteById = deleteById;
const updateStock = async (id, product) => {
    const client = await knexfile_1.default.connect();
    try {
        const result = await client.query(`UPDATE products SET stock = COALESCE($1, stock) WHERE id = $2 RETURNING *
        `, [product.stock, id]);
        return result.rows[0];
    }
    catch (err) {
        throw err;
    }
    finally {
        client.release();
    }
};
exports.updateStock = updateStock;
