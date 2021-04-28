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
          error: 'Não há produtos cadastrados para os dados informados!',
        });
      }

      res.json(products);
    });
};

/* 
	Busca os produtos com base na categoria do produto.
  Outros produtos que possuam a mesma categoria, serão retornados
*/
const readRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate('category', '_id name')
    .exec((err, products) => {
      if (err || !products) {
        return res.status(404).json({
          error: 'Não há produtos cadastrados para os dados informados!',
        });
      }

      res.json(products);
    });
};

const readProductsByCategory = (req, res) => {
  Product.distinct('category', {}, (err, categories) => {
    if (err || !categories) {
      return res.status(404).json({
        error: 'Não há categorias cadastradas para os dados informados!',
      });
    }

    res.json(categories);
  });
};

/**
 	Lista produtos através de pesquisa
 	Vamos implementar a pesquisa de produtos no frontend react
 	Vamos mostrar as categorias na caixa de seleção e a faixa de preço nos botões de opção
 	Conforme o usuário clica nessas caixas de seleção e botões de opção, faremos a solicitação 
 	a API e mostraremos os produtos aos usuários com base no que ele deseja
 */

const listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        // gte - preço maior que [0-10]
        // lte - preço menor que
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(404).json({
          error: 'Não há produtos cadastrados para os dados informados!',
        });
      }
      res.json({
        size: products.length,
        products,
      });
    });
};

const photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }

  next();
};

export {
  create,
  productById,
  read,
  readAll,
  readRelated,
  readProductsByCategory,
  listBySearch,
  remove,
  update,
  photo,
};
