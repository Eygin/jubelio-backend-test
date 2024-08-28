import db from "../config/knexfile";

export interface AdjustmentTransaction {
    id?: number;
    product_id: number;
    qty: string;
    amount: number;
}

export const getList = async (params: object) =>
{
    const client = await db.connect();
    try {
        const {page, limit} = params as any;
        const offset = (page - 1) * limit;
        const result = (await client.query('SELECT adjustment_transactions.id, adjustment_transactions.product_id, products.title, qty, amount FROM adjustment_transactions INNER JOIN products ON products.id = adjustment_transactions.product_id ORDER BY adjustment_transactions.id DESC LIMIT $1 OFFSET $2', [limit, offset])).rows;
        const countResult = await client.query('SELECT COUNT(id) AS count FROM adjustment_transactions');

        return {result, countResult}
    } catch (err) {
        console.error('Error inserting user:', err);
        throw err;
    } finally {
        client.release();
    }
}

export const create = async (adjustment: AdjustmentTransaction) => {
    const client = await db.connect();
    try {
        const result = await client.query(`INSERT INTO adjustment_transactions (product_id, qty, amount) VALUES ($1, $2, $3) RETURNING * `, [adjustment.product_id, adjustment.qty, adjustment.amount])
        return result.rows[0];
    } catch (err) {
        console.error('Error inserting transaction:', err);
        throw err;
    } finally {
        client.release();
    } 
}

export const detail = async (id: number): Promise<AdjustmentTransaction> => {
    const client = await db.connect();
    try {
        const result = await client.query(`SELECT products.sku as sku, qty, amount
             FROM adjustment_transactions
             INNER JOIN products ON products.id = adjustment_transactions.product_id
             WHERE adjustment_transactions.id = $1`, [id])

        return result.rows[0];
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}

export const update = async (id: number, adjustment: Partial<AdjustmentTransaction>): Promise<AdjustmentTransaction> => {
    const client = await db.connect();
    try {
        const result = await client.query(`UPDATE adjustment_transactions SET product_id = COALESCE($1, product_id), qty = COALESCE($2, qty), amount = COALESCE($3, amount) WHERE id = $4 RETURNING *
        `, [adjustment.product_id, adjustment.qty, adjustment.amount, id]);

        return result.rows[0];
    } catch (err) {
        throw err;
    } finally {
        client.release();
    } 
}

export const deleteById = async (id: number): Promise<AdjustmentTransaction | null> => {
    const client = await db.connect();

    try {
        const result = await client.query('DELETE FROM adjustment_transactions WHERE id = $1', [id]);
        
        return result.rows[0] || null;
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}