import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import { create, deleteById, detail, update, getList } from '../models/AdjustmentTransactionModels';
import { checkSKU, updateStock } from '../models/ProductModels';

export const listTransaction = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { page = 1, limit = 10 } = request.query as any;
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
        return h.response({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Invalid page or limit parameters',
        }).code(400);
    }

    try {
        const payload = {
            'page': pageNumber,
            'limit': pageSize
        }
        
        const transactionResult = await getList(payload)
        const totalCount = transactionResult.countResult.rows[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / pageSize);

        return {
            adjustmentTransaction: {
                page: pageNumber,
                limit: pageSize,
                totalPages: totalPages,
                totalCount: totalCount,
                results: transactionResult?.result
            }
        };
    } catch (err) {
        const error = err as Error;
        console.error('Error:', error);

        return h.response({
            statusCode: 500,
            error: 'Internal Server Error',
            message: error.message,
        }).code(500);   
    }   
}

export const createTransaction = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
        const { qty, sku } = request.payload as any;

        const schema = Joi.object({
            qty: Joi.number().required(),
            sku: Joi.string().min(3).max(50).required()
        });

        const { error } = schema.validate({ qty, sku });
    
        if (error)
        {
            return h.response({error: error.details[0].message }).code(400)
        }
    
        const dataSKu = await checkSKU(sku);
        if (!dataSKu)
        {
            return h.response({ error: 'SKU not found' }).code(404);
        }
        
        // check stock
        let finalStock;
        if (qty == 0) {
            return h.response({
                statusCode: 400,
                error: 'Bad Request',
                message: 'Quantity (qty) cannot be 0',
            }).code(400);
        } else if (qty < 0) {
            if (dataSKu.stock == 0) {
                return h.response({
                    statusCode: 400,
                    error: 'Bad Request',
                    message: 'Stock not available',
                }).code(400);
            }
            finalStock = dataSKu.stock - Math.abs(qty);
        } else {
            finalStock = parseInt(dataSKu.stock) + parseInt(qty);
        }

        const amount = dataSKu.price * Math.abs(qty);
        await updateStock(dataSKu.id, {stock: finalStock });
        const saveProduct = await create({product_id: dataSKu.id, qty:qty, amount:amount})
        return h.response({ message: 'Adjustment transaction created successfully', data: saveProduct }).code(201);
    } catch (err) {
        const error = err as Error;
        console.error('Error:', error);

        return h.response({
            statusCode: 500,
            error: 'Internal Server Error',
            message: error.message,
        }).code(500);
    }
}

export const updateTransaction = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
        const { id } = request.params;
        const { qty, sku } = request.payload as any;

        const schema = Joi.object({
            qty: Joi.number().required(),
            sku: Joi.string().min(3).max(50).required()
        });

        const { error } = schema.validate({ qty, sku });
    
        if (error)
        {
            return h.response({error: error.details[0].message }).code(400)
        }
    
        const dataSKu = await checkSKU(sku);
        if (!dataSKu)
        {
            return h.response({ error: 'SKU not found' }).code(404);
        }
        
        const detailTransaction = await detail(id);
        if (!detailTransaction)
        {
            return h.response({
                statusCode: 404,
                error: 'Not Found',
                message: 'Product not found',
            }).code(404);
        }

        let finalStock;
        if (qty == 0) {
            return h.response({
                statusCode: 400,
                error: 'Bad Request',
                message: 'Quantity (qty) cannot be 0',
            }).code(400);
        } else if (qty < 0) {
            if (dataSKu.stock == 0) {
                return h.response({
                    statusCode: 400,
                    error: 'Bad Request',
                    message: 'Stock not available',
                }).code(400);
            }
            finalStock = dataSKu.stock - Math.abs(qty);
        } else {
            finalStock = parseInt(dataSKu.stock) + parseInt(qty);
        }

        const amount = dataSKu.price * Math.abs(qty);
        await updateStock(dataSKu.id, {stock: finalStock });
        const saveProduct = await update(id, {product_id: dataSKu.id, qty:qty, amount:amount})
        return h.response({ message: 'Adjustment transaction updated successfully', data: saveProduct }).code(201);

    } catch (err) {
        const error = err as Error;
        console.error('Error:', error);

        return h.response({
            statusCode: 500,
            error: 'Internal Server Error',
            message: error.message,
        }).code(500);   
    }
}

export const detailTransaction = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
        const {id} = request.params;
        const adjustmentDetail = await detail(id);

        if (!adjustmentDetail) {
            return h.response({
                statusCode: 404,
                error: 'Not Found',
                message: 'Adjustment Transaction not found',
            }).code(404);   
        }

        return h.response({'data':adjustmentDetail}).code(200);
    } catch (err) {
        const error = err as Error;
        console.error('Error:', error);

        return h.response({
            statusCode: 500,
            error: 'Internal Server Error',
            message: error.message,
        }).code(500);
    }
}

export const deleteTransaction = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
        const {id} = request.params;

        const adjustment = await detail(id);
        if (!adjustment) {
            return h.response({
                statusCode: 404,
                error: 'Not Found',
                message: 'Product not found',
            }).code(404);
        }

        const transactionDelete = await deleteById(id);

        return h.response({
            message: 'Adjustment Transaction successfully',
            data: transactionDelete,
        }).code(200);
    } catch (err) {
        const error = err as Error;
        console.error('Error:', error);

        return h.response({
            statusCode: 500,
            error: 'Internal Server Error',
            message: error.message,
        }).code(500);
    }
}