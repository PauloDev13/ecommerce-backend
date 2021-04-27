import formidable from 'formidable';
import lodash, { toInteger } from 'lodash';
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
  req.product.photo = undefined;
  res.json(req.product);
};

const remove = (req, res) => {
  let product = req.product;

  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: `${deletedProduct.name} removido com sucesso!`,
    });
  });
};

const update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Erro ao carregar imagem!',
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

    let product = req.product;
    product = lodash.extend(product, fields);

    if (files.photo) {
      if (files.photo.size > 2000000) {
        return res.status(400).json({
          error: 'Imagem deve ter até 2 MB de tamanho!',
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

/* 
	Venda/Entrega
	por venda = /products?sortBy=sold&order=desc&limit=4
	por entrega = /products?sortBy=createdAt&order=desc&limit=4
	Se não for informado nenhum parâmetro, retorna todos os produtos
*/

const readAll = (req, res) => {
  let order = req.query.order ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err || !products) {
        return res.status(404).json({
          error: 'Produto não cadastrado!',
        });
      }

      res.json(products);
    });
};

export { create, productById, read, readAll, remove, update };
