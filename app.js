import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const app = express();

mongoose
  .connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('BD conectado com sucesso!'))
  .catch((err) => console.log('Erro ao conectar BD', err));

const port = process.env.PORT || 8000;

app.listen(port, () =>
  console.log('Servidor rodando em http://localhost:', port)
);
