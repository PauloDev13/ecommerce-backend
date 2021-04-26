import jwt from 'jsonwebtoken'; // para gerar o token
import expressJwt from 'express-jwt'; // para autorização de acesso

import User from '../models/user.model';
import { errorHandler } from '../helpers/dbErrorHandler';

const signup = (req, res) => {
  const user = new User(req.body);
  console.log(user);

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    user.salt = undefined;
    user.hashed_password = undefined;

    res.json({
      user,
    });
  });
};

const signin = (req, res) => {
  const { email, password } = req.body;

  // busca o usuário pelo email
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(404).json({
        error: `Usuário não encontrado para o e-mail: ${email}!`,
      });
    }
    /* se o usuário existir, testa email e senha informados
			 com o método authenticate no model usuário
		*/
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Email e/ou Senha inválido!',
      });
    }

    // gera token de acesso com ID do usuário e uma chave secreta
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // coloca o token e sua data de expiração nos cookies
    res.cookie('t', token, { expire: new Date() + 9999 });
    // retorna os dados usuário + token para o frontend
    const { _id, email, name, role } = user;
    return res.json({
      token,
      user: {
        _id,
        email,
        name,
        role,
      },
    });
  });
};

const signout = (req, res) => {
  res.clearCookie('t');
  res.json({ message: 'Logout efetuado com sucesso!' });
};

export { signup, signin, signout };
