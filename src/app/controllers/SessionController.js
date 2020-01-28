import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
// importa arquivo de configuracao

import User from '../models/User';
import File from '../models/File';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    // verificar se o usuario existe

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }
    // verifica se a senha bate... importando o checkpassowrd do model

    const { id, name, avatar, provider } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        provider,
        avatar,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
      // retorna os dados do usuario
      // toke: 1-payload(informacoes adicionais)
      // 2- uma string criptografada (md5online)
      // 3- expiracao
    });
  }
}

export default new SessionController();
