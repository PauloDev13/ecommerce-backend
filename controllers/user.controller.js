import User from '../models/user.model';
import { errorHandler } from '../helpers/dbErrorHandler';

const userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(404).json({
        error: 'Usuário não cadastrado!',
      });
    }

    req.profile = user;
    next();
  });
};

export { userById };
