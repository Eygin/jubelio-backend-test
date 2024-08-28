import Hapi from '@hapi/hapi';
import { register, login, getUser } from '../controllers/authController';
import { getListProduct, createProduct, getDetailProduct, updateProduct, deleteProduct, fetchProduct } from '../controllers/productController';
import { createTransaction, deleteTransaction, detailTransaction, listTransaction, updateTransaction } from '../controllers/adjustmentTransactionController';

const apiRoutes: Hapi.ServerRoute[] = [
    {
        method: 'POST',
        path: '/register',
        handler: register,
    },
    {
        method: 'POST',
        path: '/login',
        handler: login,
    },
    {
        method: 'GET',
        path: '/user',
        handler: getUser,
        options: {
            auth: 'jwt'
        }
    },
    {
        method: 'GET',
        path: '/product',
        handler: getListProduct,
        options: {
            auth: 'jwt'
        }
    },
    {
        method: 'POST',
        path: '/product',
        options: {
            auth: 'jwt'
        },
        handler: createProduct
    },
    {
        method: 'GET',
        path: '/product/{id}',
        options: {
            auth: 'jwt'
        },
        handler: getDetailProduct
    },
    {
        method: 'PUT',
        path: '/product/{id}',
        options: {
            auth: 'jwt'
        },
        handler: updateProduct
    },
    {
        method: 'DELETE',
        path: '/product/{id}',
        options: {
            auth: 'jwt'
        },
        handler: deleteProduct
    },
    {
        method: 'GET',
        path: '/product/fetch-data',
        options: {
            auth: 'jwt'
        },
        handler: fetchProduct
    },
    {
        method: 'POST',
        path: '/transaction-adjustment',
        options: {
            auth: 'jwt'
        },
        handler: createTransaction
    },
    {
        method: 'PUT',
        path: '/transaction-adjustment/{id}',
        options: {
            auth: 'jwt'
        },
        handler: updateTransaction
    },
    {
        method: 'GET',
        path: '/transaction-adjustment/{id}',
        options: {
            auth: 'jwt'
        },
        handler: detailTransaction
    },
    {
        method: 'DELETE',
        path: '/transaction-adjustment/{id}',
        options: {
            auth: 'jwt'
        },
        handler: deleteTransaction
    },
    {
        method: 'GET',
        path: '/transaction-adjustment',
        options: {
            auth: 'jwt'
        },
        handler: listTransaction
    }
];

export default apiRoutes;