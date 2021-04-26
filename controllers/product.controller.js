import formidable from 'formidable';
import lodash from 'lodash';
import fs from 'fs';

import { errorHandler } from '../helpers/dbErrorHandler';
import Product from '../models/product.model';

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

export { create };
