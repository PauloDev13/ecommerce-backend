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

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;

  return res.json(req.profile);
};

const update = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({
          error: 'Usuário não autorizado para realizar esta ação!',
        });
      }

      user.hashed_password = undefined;
      user.salt = undefined;

      res.json(user);
    }
  );
};

export { userById, read, update };
