import User from '../models/User';
import File from '../models/File';

class ProvidersController {
  async index(req, res) {
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

    return res.json(providers);
  }
  // listar os providers
}

export default new ProvidersController();
