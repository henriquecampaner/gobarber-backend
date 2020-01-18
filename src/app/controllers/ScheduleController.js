import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointments from '../models/Appointments';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    // localiza o provider

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }
    // checa para ver se e um provider

    const { date } = req.query;
    // pega o dia via query

    const parsedDate = parseISO(date);

    // 2019-12-02 00:00:00
    // 2019-12-02 23:59:59

    const appointments = await Appointments.findAll({
      where: {
        provider_id: req.userId,
        // prestador igual usuario logado
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
