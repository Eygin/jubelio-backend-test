"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteById = exports.update = exports.detail = exports.create = void 0;
const knexfile_1 = __importDefault(require("../config/knexfile"));
const create = async (adjustment) => {
    const client = await knexfile_1.default.connect();
    try {
        const result = await client.query(`INSERT INTO adjustment_transactions (product_id, qty, amount) VALUES ($1, $2, $3) RETURNING * `, [adjustment.product_id, adjustment.qty, adjustment.amount]);
        return result.rows[0];
    }
    catch (err) {
        console.error('Error inserting transaction:', err);
        throw err;
    }
    finally {
        client.release();
    }
};
exports.create = create;
const detail = async (id) => {
    const client = await knexfile_1.default.connect();
    try {
        const result = await client.query(`SELECT products.sku as sku, qty, amount
             FROM adjustment_transactions
             INNER JOIN products ON products.id = adjustment_transactions.product_id
             WHERE adjustment_transactions.id = $1`, [id]);
        return result.rows[0];
    }
    catch (err) {
        throw err;
    }
    finally {
        client.release();
    }
};
exports.detail = detail;
const update = async (id, adjustment) => {
    const client = await knexfile_1.default.connect();
    try {
        const result = await client.query(`UPDATE adjustment_transactions SET product_id = COALESCE($1, product_id), qty = COALESCE($2, qty), amount = COALESCE($3, amount) WHERE id = $4 RETURNING *
        `, [adjustment.product_id, adjustment.qty, adjustment.amount, id]);
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
        const result = await client.query('DELETE FROM adjustment_transactions WHERE id = $1', [id]);
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
