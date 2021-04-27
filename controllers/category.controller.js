import { errorHandler } from '../helpers/dbErrorHandler';
import Category from '../models/category.model';

const categoryById = (req, res, next, id) => {
  console.log(id);
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(404).json({
        error: 'Categoria não cadastrada!',
      });
    }
    console.log(req.category);
    req.category = category;
    next();
  });
};

const read = (req, res) => {
  res.json(req.category);
};

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

export { create, categoryById, read };
