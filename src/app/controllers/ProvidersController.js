import User from '../models/User';
import File from '../models/File';

import Cache from '../../lib/Cache';

class ProvidersController {
  async index(req, res) {
    const cached = await Cache.get('providers');

    if (cached) {
      return res.json(cached);
    }

    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
      // buscar os privders e filtrar quais informacoes serao listadas
    });

    await Cache.set('providers', providers);

    return res.json(providers);
  }
  // listar os providers
}

export default new ProvidersController();
