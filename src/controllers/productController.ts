import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import { getList, create, checkSKU, detail, update, deleteById, getSKU } from '../models/ProductModels';

export const getListProduct = async (request: Hapi.Request, h: Hapi.ResponseToolkit) =>
{
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
        
        const productResult = await getList(payload)
        const totalCount = productResult.countResult.rows[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / pageSize);

        return {
            product: {
                page: pageNumber,
                limit: pageSize,
                totalPages: totalPages,
                totalCount: totalCount,
                results: productResult?.result
            }
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        return h.response({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Unable to fetch products',
        }).code(500);
    }
}

export const getListSKU = async (request: Hapi.Request, h: Hapi.ResponseToolkit) =>
{
    try {
        const productResult = await getSKU()

        return {
            sku: productResult
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        return h.response({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Unable to fetch products',
        }).code(500);
    }
}

export const createProduct = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
        const { title, sku, image, price, description, stock } = request.payload as any;

        const schema = Joi.object({
            title: Joi.string().min(3).max(100).required(),
            sku: Joi.string().min(3).max(50).required(),
            image: Joi.string().uri().allow(null), // Accepts a URI or null
            price: Joi.number().required(),
            description: Joi.string().allow(null), // Accepts a string or null
            stock: Joi.number().required()
        });

        const { error } = schema.validate({ title, sku, image, price, description, stock });
    
        if (error)
        {
            return h.response({error: error.details[0].message }).code(400)
        }
    
        const dataSKu = await checkSKU(sku);
        if (dataSKu)
        {
            return h.response({ error: 'SKU already used' }).code(400);
        }
    
        const saveProduct = await create({title, sku, image, price, description, stock})
        return h.response({ message: 'Product created successfully', data: saveProduct }).code(201);

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

export const getDetailProduct = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
        const { id } = request.params;
        const product = await detail(id);

        if (!product) {
            return h.response({
                statusCode: 404,
                error: 'Not Found',
                message: 'Product not found',
            }).code(404);   
        }

        return h.response({'data':product}).code(200);
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

export const updateProduct = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
        const { id } = request.params;
        const { title, sku, image, price, description } = request.payload as any;

        const schema = Joi.object({
            title: Joi.string().min(3).max(100).required(),
            sku: Joi.string().min(3).max(50).required(),
            image: Joi.string().min(3).required(),
            price: Joi.number().required(),
            description: Joi.string().allow(null)
        });

        const { error } = schema.validate({ title, sku, image, price, description });

        if (error) {
            return h.response({ error: error.details[0].message }).code(400);
        }

        const existingProduct = await detail(id);
        if (!existingProduct) {
            return h.response({
                statusCode: 404,
                error: 'Not Found',
                message: 'Product not found',
            }).code(404);
        }

        const dataSKu = await checkSKU(sku);
        if (dataSKu)
        {
            if (dataSKu.id != id) {
                return h.response({ error: 'SKU already used' }).code(400);
            }
        }

        const updatedProduct = await update(id, { title, sku, image, price, description });

        return h.response({
            message: 'Product updated successfully',
            data: updatedProduct,
        }).code(200);
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

export const deleteProduct = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
        const { id } = request.params;
        const existingProduct = await detail(id);
        if (!existingProduct) {
            return h.response({
                statusCode: 404,
                error: 'Not Found',
                message: 'Product not found',
            }).code(404);
        }
    
        const product = await deleteById(id);
        return h.response({
            message: 'Product deleted successfully',
            data: product,
        }).code(200);

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

export const fetchProduct = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
        const { page = 1, limit = 10 } = request.query as any;
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
        console.log(pageNumber, pageSize)
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
            const dataSKu = await checkSKU(product.sku);
            if (!dataSKu) {
                const saveProduct = await create({
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