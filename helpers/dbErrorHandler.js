'use strict';

/**
 * Pega o erro dos campos marcados como unique
 */
const uniqueMessage = (error) => {
  let output;
  try {
    let fieldName = error.message.substring(
      error.message.lastIndexOf('.$') + 2,
      error.message.lastIndexOf('_1')
    );
    output =
      fieldName.charAt(0).toUpperCase() +
      fieldName.slice(1) +
      ' já cadastrado!';
  } catch (ex) {
    output = 'Campo já cadastrado!';
  }

  return output;
};

/**
 * Pega a mensagem de erro do objeto de erro
 */
const errorHandler = (error) => {
  let message = '';

  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = uniqueMessage(error);
        break;
      default:
        message = 'Algo deu errado!';
    }
  } else {
    for (let errorName in error.errorors) {
      if (error.errorors[errorName].message)
        message = error.errorors[errorName].message;
    }
  }

  return message;
};

export { errorHandler };
