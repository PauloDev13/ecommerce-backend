import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';

import userRouter from './routes/user.routes';

// Configuração do dotenv
config();

const app = express();

// Conexão com o bando de dados
mongoose
  .connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('BD conectado com sucesso!'))
  .catch((err) => console.log('Erro ao conectar BD', err));

// Middlewares de rotas
app.use('/api', userRouter);

const port = process.env.PORT || 8000;

// Inicialização do servidor
app.listen(port, () =>
  console.log('Servidor rodando em http://localhost:', port)
);
