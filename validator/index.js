const userSignupValidator = (req, res, next) => {
  req.check('name', 'Nome é obrigatório!').notEmpty();
  req.check('email', 'Email é obrigatório!').notEmpty();
  req
    .check('email', 'Email deve ter entre 4 e 32 caracteres!')
    .matches(/.+\@.+\./)
    .withMessage('Email inválido!')
    .isLength({
      min: 4,
      max: 32,
    });

  req.check('password', 'Senha é obrigatória!').notEmpty();
  req
    .check('password', 'Senha deve ter no mínimo 6 caracteres!')
    .isLength({
      min: 6,
    })
    .matches(/\d/)
    .withMessage('Senha deve conter letras e números!');

  const errors = req.validationErrors();

  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }

  next();
};

export { userSignupValidator };
