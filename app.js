import express from 'express';
import expressValidator from 'express-validator';
// import dotenv from 'dotenv/config.js';
import cookieParser from 'cookie-parser';
const morgan = require('morgan');

import ManageDB from './db/mongoDb';

import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import categoryRouter from './routes/category.routes';
import productRouter from './routes/product.routes';

const app = express();

// Conexão com o bando de dados
ManageDB.connect();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(expressValidator());

// Middlewares de rotas
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', categoryRouter);
app.use('/api', productRouter);

const port = process.env.PORT || 8000;

// Inicialização do servidor
app.listen(port, () =>
  console.log('Servidor rodando em http://localhost:', port)
);
