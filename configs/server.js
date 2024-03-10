'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js';
import userRoutes from '../src/user/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import categoryRoutes from '../src/category/category.routes.js'
import ProductRoutes from '../src/product/product.routes.js';
import CartRoutes from '../src/cart/cart.routes.js';
import BillRoutes from '../src/bill/bill.routes.js';

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuarioPath = '/api/v1/users'
        this.authPath = '/api/v1/auth'
        this.categoryPath = '/api/v1/categoria'
        this.productPath = '/api/v1/productos'
        this.cartPath = '/finalAPI/v1/cart'
        this.billPath = '/api/v1/bill';

        this.middlewares();
        this.conectarDB();
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.usuarioPath, userRoutes);
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.categoryPath, categoryRoutes);
        this.app.use(this.productPath, ProductRoutes);
        this.app.use(this.cartPath, CartRoutes);
        this.app.use(this.billPath, BillRoutes);

    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
}

export default Server;