"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchProduct = exports.deleteProduct = exports.updateProduct = exports.getDetailProduct = exports.createProduct = exports.getListProduct = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const ProductModels_1 = require("../models/ProductModels");
const getListProduct = async (request, h) => {
    const { page = 1, limit = 10 } = request.query;
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
        };
        const productResult = await (0, ProductModels_1.getList)(payload);
        const totalCount = productResult.countResult.rows[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / pageSize);
        return {
            page: pageNumber,
            limit: pageSize,
            totalPages,
            totalCount,
            product: productResult?.result
        };
    }
    catch (error) {
        console.error('Error fetching products:', error);
        return h.response({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Unable to fetch products',
        }).code(500);
    }
};
exports.getListProduct = getListProduct;
const createProduct = async (request, h) => {
    try {
        const { title, sku, image, price, description, stock } = request.payload;
        const schema = joi_1.default.object({
            title: joi_1.default.string().min(3).max(100).required(),
            sku: joi_1.default.string().min(3).max(50).required(),
            image: joi_1.default.string().uri().allow(null), // Accepts a URI or null
            price: joi_1.default.number().required(),
            description: joi_1.default.string().allow(null), // Accepts a string or null
            stock: joi_1.default.number().required()
        });
        const { error } = schema.validate({ title, sku, image, price, description, stock });
        if (error) {
            return h.response({ error: error.details[0].message }).code(400);
        }
        const dataSKu = await (0, ProductModels_1.checkSKU)(sku);
        if (dataSKu) {
            return h.response({ error: 'SKU already used' }).code(400);
        }
        const saveProduct = await (0, ProductModels_1.create)({ title, sku, image, price, description, stock });
        return h.response({ message: 'Product created successfully', data: saveProduct }).code(201);
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
exports.createProduct = createProduct;
const getDetailProduct = async (request, h) => {
    try {
        const { id } = request.params;
        const product = await (0, ProductModels_1.detail)(id);
        if (!product) {
            return h.response({
                statusCode: 404,
                error: 'Not Found',
                message: 'Product not found',
            }).code(404);
        }
        return h.response({ 'data': product }).code(200);
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
exports.getDetailProduct = getDetailProduct;
const updateProduct = async (request, h) => {
    try {
        const { id } = request.params;
        const { title, sku, image, price, description } = request.payload;
        const schema = joi_1.default.object({
            title: joi_1.default.string().min(3).max(100).required(),
            sku: joi_1.default.string().min(3).max(50).required(),
            image: joi_1.default.string().min(3).required(),
            price: joi_1.default.number().required(),
            description: joi_1.default.string().allow(null)
        });
        const { error } = schema.validate({ title, sku, image, price, description });
        if (error) {
            return h.response({ error: error.details[0].message }).code(400);
        }
        const existingProduct = await (0, ProductModels_1.detail)(id);
        if (!existingProduct) {
            return h.response({
                statusCode: 404,
                error: 'Not Found',
                message: 'Product not found',
            }).code(404);
        }
        const dataSKu = await (0, ProductModels_1.checkSKU)(sku);
        if (dataSKu) {
            if (dataSKu.id != id) {
                return h.response({ error: 'SKU already used' }).code(400);
            }
        }
        const updatedProduct = await (0, ProductModels_1.update)(id, { title, sku, image, price, description });
        return h.response({
            message: 'Product updated successfully',
            data: updatedProduct,
        }).code(200);
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
exports.updateProduct = updateProduct;
const deleteProduct = async (request, h) => {
    try {
        const { id } = request.params;
        const existingProduct = await (0, ProductModels_1.detail)(id);
        if (!existingProduct) {
            return h.response({
                statusCode: 404,
                error: 'Not Found',
                message: 'Product not found',
            }).code(404);
        }
        const product = await (0, ProductModels_1.deleteById)(id);
        return h.response({
            message: 'Product deleted successfully',
            data: product,
        }).code(200);
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
exports.deleteProduct = deleteProduct;
const fetchProduct = async (request, h) => {
    try {
        const { page = 1, limit = 10 } = request.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const offset = (page - 1) * limit;
        if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
            return h.response({
                statusCode: 400,
                error: 'Bad Request',
                message: 'Invalid page or limit parameters',
            }).code(400);
        }
        console.log(pageNumber, pageSize);
        const response = await fetch(`https://dummyjson.com/products?limit=${pageSize}&skip=${offset}&select=title,sku,thumbnail,price,description,stock`);
        const data = await response.json();
        if (!data || !data.products || data.products.length === 0) {
            return h.response({
                statusCode: 404,
                error: 'Not Found',
                message: 'Product not found',
            }).code(404);
        }
        for (const product of data.products) {
            const dataSKu = await (0, ProductModels_1.checkSKU)(product.sku);
            if (!dataSKu) {
                const saveProduct = await (0, ProductModels_1.create)({
                    title: product.title,
                    sku: product.sku,
                    image: product.thumbnail,
                    price: product.price,
                    description: product.description,
                    stock: product.stock
                });
            }
        }
        return h.response({
            statusCode: 200,
            message: 'Products processed fetching data successfully',
        }).code(200);
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
exports.fetchProduct = fetchProduct;
