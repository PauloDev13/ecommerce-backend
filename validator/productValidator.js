exports.productValidator = (
  name,
  description,
  category,
  price,
  quantity,
  res
) => {
  if (!name) {
    return res.status(400).json({
      error: 'Nome é obrigatório!',
    });
  }

  if (!description) {
    return res.status(400).json({
      error: 'Descrição é obrigatório!',
    });
  }
  if (!category) {
    return res.status(400).json({
      error: 'Categoria é obrigatória!',
    });
  }
  if (!price) {
    return res.status(400).json({
      error: 'Preço é obrigatório!',
    });
  }
  if (!quantity) {
    return res.status(400).json({
      error: 'Quantidade é obrigatória!',
    });
  }
};
