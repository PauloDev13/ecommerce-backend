import { Router } from 'express';
import { isAuth, isAdmin, requireSignin } from '../controllers/auth.controller';
import { userById } from '../controllers/user.controller';
import {
  create,
  productById,
  read,
  readAll,
  readRelated,
  readProductsByCategory,
  listBySearch,
  remove,
  update,
} from '../controllers/product.controller';

const router = Router();
// Lista todos os produtos
router.get('/products', readAll);
// Lista os produtos que pertecem a mesma categoria do produto informado no productId
router.get('/products/related/:productId', readRelated);
// Lista as categorias relacionadas com os produtos
router.get('/products/categories', readProductsByCategory);
// Busca um produto pelo productId
router.get('/product/:productId', read);
// Retorna lista de produtos de acordo com os parâmetros informados pelo usuário no frontend
router.post('/products/by/search', listBySearch);
// Salva um produto
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
// Atualiza um produto
router.put(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  update
);
// Remove um produto
router.delete(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  remove
);

// Recebe o parêmtro userId vindo na url
router.param('userId', userById);
// Recebe o parêmtro productId vindo na url
router.param('productId', productById);

export default router;
