import express from 'express';

// Bibliotecas auxiliares
import expressValidator from 'express-validator';
// import dotenv from 'dotenv/config.js';
import cookieParser from 'cookie-parser';
const morgan = require('morgan');
import cors from 'cors';
import statusMonitor from 'express-status-monitor';
import compression from 'compression';
import helmet from 'helmet';

// Imports do backend
import ManageDB from './db/mongoDb';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import categoryRouter from './routes/category.routes';
import productRouter from './routes/product.routes';

// Cia app
const app = express();

// Conexão com o bando de dados
ManageDB.connect();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
// disponibiliza monitoramente gráfico do backend no path informado
app.use(statusMonitor({ path: '/monitor' }));
// Comprime as respostas das chamadas aos endpoints, aumentando a performancea
app.use(compression());
// Retira do header da resposta que o backend foi desenvolvido com express
app.use(helmet());

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
