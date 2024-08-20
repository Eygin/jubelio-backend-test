"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.detailTransaction = exports.updateTransaction = exports.createTransaction = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const AdjustmentTransactionModels_1 = require("../models/AdjustmentTransactionModels");
const ProductModels_1 = require("../models/ProductModels");
const createTransaction = async (request, h) => {
    try {
        const { qty, sku } = request.payload;
        const schema = joi_1.default.object({
            qty: joi_1.default.number().required(),
            sku: joi_1.default.string().min(3).max(50).required()
        });
        const { error } = schema.validate({ qty, sku });
        if (error) {
            return h.response({ error: error.details[0].message }).code(400);
        }
        const dataSKu = await (0, ProductModels_1.checkSKU)(sku);
        if (!dataSKu) {
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
        }
        else if (qty < 0) {
            if (dataSKu.stock == 0) {
                return h.response({
                    statusCode: 400,
                    error: 'Bad Request',
                    message: 'Stock not available',
                }).code(400);
            }
            finalStock = dataSKu.stock - Math.abs(qty);
        }
        else {
            finalStock = parseInt(dataSKu.stock) + parseInt(qty);
        }
        const amount = dataSKu.price * Math.abs(qty);
        await (0, ProductModels_1.updateStock)(dataSKu.id, { stock: finalStock });
        const saveProduct = await (0, AdjustmentTransactionModels_1.create)({ product_id: dataSKu.id, qty: qty, amount: amount });
        return h.response({ message: 'Adjustment transaction created successfully', data: saveProduct }).code(201);
    }
    catch (err) {
        const error = err;
        console.error('Error:', error);
        return h.response({
            statusCode: 500,
            error: 'Internal Server Error',
            message: error.message,
        }).code(500);
    }
};
exports.createTransaction = createTransaction;
const updateTransaction = async (request, h) => {
    try {
        const { id } = request.params;
        const { qty, sku } = request.payload;
        const schema = joi_1.default.object({
            qty: joi_1.default.number().required(),
            sku: joi_1.default.string().min(3).max(50).required()
        });
        const { error } = schema.validate({ qty, sku });
        if (error) {
            return h.response({ error: error.details[0].message }).code(400);
        }
        const dataSKu = await (0, ProductModels_1.checkSKU)(sku);
        if (!dataSKu) {
            return h.response({ error: 'SKU not found' }).code(404);
        }
        const detailTransaction = await (0, AdjustmentTransactionModels_1.detail)(id);
        if (!detailTransaction) {
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
        }
        else if (qty < 0) {
            if (dataSKu.stock == 0) {
                return h.response({
                    statusCode: 400,
                    error: 'Bad Request',
                    message: 'Stock not available',
                }).code(400);
            }
            finalStock = dataSKu.stock - Math.abs(qty);
        }
        else {
            finalStock = parseInt(dataSKu.stock) + parseInt(qty);
        }
        const amount = dataSKu.price * Math.abs(qty);
        await (0, ProductModels_1.updateStock)(dataSKu.id, { stock: finalStock });
        const saveProduct = await (0, AdjustmentTransactionModels_1.update)(id, { product_id: dataSKu.id, qty: qty, amount: amount });
        return h.response({ message: 'Adjustment transaction updated successfully', data: saveProduct }).code(201);
    }
    catch (err) {
        const error = err;
        console.error('Error:', error);
        return h.response({
            statusCode: 500,
            error: 'Internal Server Error',
            message: error.message,
        }).code(500);
    }
};
exports.updateTransaction = updateTransaction;
const detailTransaction = async (request, h) => {
    try {
        const { id } = request.params;
        const adjustmentDetail = await (0, AdjustmentTransactionModels_1.detail)(id);
        if (!adjustmentDetail) {
            return h.response({
                statusCode: 404,
                error: 'Not Found',
                message: 'Adjustment Transaction not found',
            }).code(404);
        }
        return h.response({ 'data': adjustmentDetail }).code(200);
    }
    catch (err) {
        const error = err;
        console.error('Error:', error);
        return h.response({
            statusCode: 500,
            error: 'Internal Server Error',
            message: error.message,
        }).code(500);
    }
};
exports.detailTransaction = detailTransaction;
const deleteTransaction = async (request, h) => {
    try {
        const { id } = request.params;
        const adjustment = await (0, AdjustmentTransactionModels_1.detail)(id);
        if (!adjustment) {
            return h.response({
                statusCode: 404,
                error: 'Not Found',
                message: 'Product not found',
            }).code(404);
        }
        const transactionDelete = await (0, AdjustmentTransactionModels_1.deleteById)(id);
        return h.response({
            message: 'Adjustment Transaction successfully',
            data: transactionDelete,
        }).code(200);
    }
    catch (err) {
        const error = err;
        console.error('Error:', error);
        return h.response({
            statusCode: 500,
            error: 'Internal Server Error',
            message: error.message,
        }).code(500);
    }
};
exports.deleteTransaction = deleteTransaction;
