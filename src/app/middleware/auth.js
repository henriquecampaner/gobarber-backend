import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // pega o token de dentro do req

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');
  // tranforma o retorno (Bearer e o token) em 2 partes

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // decodifica o token e retorna os dados, e o id que foi passado como payload

    req.userId = decoded.id;
    // inclui o id do usuario dentro da requisicao

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }

  return next();
};
