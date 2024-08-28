"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = require("../controllers/authController");
const productController_1 = require("../controllers/productController");
const adjustmentTransactionController_1 = require("../controllers/adjustmentTransactionController");
const apiRoutes = [
    {
        method: 'POST',
        path: '/register',
        handler: authController_1.register,
    },
    {
        method: 'POST',
        path: '/login',
        handler: authController_1.login,
    },
    {
        method: 'GET',
        path: '/user',
        handler: authController_1.getUser
    },
    {
        method: 'GET',
        path: '/product',
        handler: productController_1.getListProduct,
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
        handler: productController_1.createProduct
    },
    {
        method: 'GET',
        path: '/product/{id}',
        options: {
            auth: 'jwt'
        },
        handler: productController_1.getDetailProduct
    },
    {
        method: 'PUT',
        path: '/product/{id}',
        options: {
            auth: 'jwt'
        },
        handler: productController_1.updateProduct
    },
    {
        method: 'DELETE',
        path: '/product/{id}',
        options: {
            auth: 'jwt'
        },
        handler: productController_1.deleteProduct
    },
    {
        method: 'GET',
        path: '/product/fetch-data',
        options: {
            auth: 'jwt'
        },
        handler: productController_1.fetchProduct
    },
    {
        method: 'POST',
        path: '/transaction-adjustment',
        options: {
            auth: 'jwt'
        },
        handler: adjustmentTransactionController_1.createTransaction
    },
    {
        method: 'PUT',
        path: '/transaction-adjustment/{id}',
        options: {
            auth: 'jwt'
        },
        handler: adjustmentTransactionController_1.updateTransaction
    },
    {
        method: 'GET',
        path: '/transaction-adjustment/{id}',
        options: {
            auth: 'jwt'
        },
        handler: adjustmentTransactionController_1.detailTransaction
    },
    {
        method: 'DELETE',
        path: '/transaction-adjustment/{id}',
        options: {
            auth: 'jwt'
        },
        handler: adjustmentTransactionController_1.deleteTransaction
    }
];
exports.default = apiRoutes;
