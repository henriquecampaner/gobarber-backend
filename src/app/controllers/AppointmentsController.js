import User from '../models/User';
import Appointments from '../models/Appointments';
import File from '../models/File';

import CreateAppointmentService from '../services/CreateAppointmentService';
import CancelAppointmentService from '../services/CancelAppointmentService';

import Cache from '../../lib/Cache';

class AppointmentsController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const cacheKey = `user:${req.userId}:appointments:${page}`;

    const cached = await Cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const appointments = await Appointments.findAll({
      where: { user_id: req.userId, canceled_at: null },
      // onde esta o usuario
      order: ['date'],
      // ordena por data
      attributes: ['id', 'date', 'past', 'cancelable'],
      // seleciona quais campos aparecerao
      limit: 20,
      // limite da lsitagem
      offset: (page - 1) * 20,
      // conta para saber quantos registros pular de acordo com a pagina
      include: [
        // o que sera incluido no retorno
        {
          model: User,
          // relacionamento com a tabela
          as: 'provider',
          // qual parte do relacionamento
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
              // dados para retornar o avatar
            },
          ],
        },
      ],
    });

    await Cache.set(cacheKey, appointments);

    return res.json(appointments);
  }

  async store(req, res) {
    const { provider_id, date } = req.body;

    const appointment = await CreateAppointmentService.run({
      provider_id,
      user_id: req.userId,
      date,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await CancelAppointmentService.run({
      provider_id: req.params.id,
      user_id: req.userId,
    });

    return res.json(appointment);
  }
}

export default new AppointmentsController();
