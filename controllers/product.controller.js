import formidable from 'formidable';
import lodash from 'lodash';
import fs from 'fs';

import { errorHandler } from '../helpers/dbErrorHandler';
import Product from '../models/product.model';

const productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(404).json({
        error: 'Produto não cadastrado!',
      });
    }

    req.product = product;
    next();
  });
};

const read = (req, res) => {
  console.log(req.product);
  req.product.photo = undefined;
  res.json(req.product);
};

const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Erro ao carregar imagem!',
      });
    }

    let product = new Product(fields);

    if (files.photo) {
      if (files.photo.size > 2000000) {
        return res.status(400).json({
          error: 'Imagem deve ter até 2 MB de tamanho!',
        });
      }

      const { name, description, price, category, quantity, shipping } = fields;

      if (
        !name ||
        !description ||
        !price ||
        !category ||
        !quantity ||
        !shipping
      ) {
        return res.status(400).json({
          error: 'Todos os campos devem ser informados',
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }

      res.json({ product });
    });
  });
};

export { create, productById, read };
