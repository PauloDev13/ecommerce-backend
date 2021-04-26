import { errorHandler } from '../helpers/dbErrorHandler';
import Category from '../models/category.model';

const create = (req, res) => {
  const category = new Category(req.body);

  category.save((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    res.json({ category });
  });
};

export { create };
