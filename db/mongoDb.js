import mongoose from 'mongoose';

class ManageDB {
  static async connect() {
    await mongoose
      .connect(process.env.MONGO_URL, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch((err) => console.log('Erro ao conectar BD', err));

    console.log('BD conectado com sucesso!');
  }

  static async close() {
    await mongoose.connection
      .close()
      .catch((err) => console.log(`Erro ao fechar conexão com o BD`, err));

    console.log('Conexão com o BD encerrada com sucesso!');
  }
}

export default ManageDB;
