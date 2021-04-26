import express from "express";
import expressValidator from "express-validator";
import mongoose from "mongoose";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
const morgan = require("morgan");

import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";

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
  .then(() => console.log("BD conectado com sucesso!"))
  .catch((err) => console.log("Erro ao conectar BD", err));

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(expressValidator());

// Middlewares de rotas
app.use("/api", authRouter);
app.use("/api", userRouter);

const port = process.env.PORT || 8000;

// Inicialização do servidor
app.listen(port, () =>
  console.log("Servidor rodando em http://localhost:", port)
);
