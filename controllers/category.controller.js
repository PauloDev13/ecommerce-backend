import lodash from 'lodash';

import { errorHandler } from '../helpers/dbErrorHandler';
import Category from '../models/category.model';

const readAll = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories) {
      return res.status(404).json({
        error: errorHandler(err),
      });
    }
    res.json(categories);
  });
};

const categoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
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

const remove = (req, res) => {
  let category = req.category;

  category.remove((err, deletedCategory) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: `${deletedCategory.name} removido com sucesso!`,
    });
  });
};

const update = (req, res) => {
  let category = req.category;
  category = lodash.extend(category, req.body);

  category.save((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    res.json(category);
  });
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

export { categoryById, read, readAll, remove, update, create };
