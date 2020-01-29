import { subHours, isBefore } from 'date-fns';

import User from '../models/User';
import Appointments from '../models/Appointments';

import Queue from '../../lib/Queue';

import CancellationMain from '../jobs/CancellationMail';

import Cache from '../../lib/Cache';

class CancelAppointmentService {
  async run({ provider_id, user_id }) {
    const appointment = await Appointments.findByPk(provider_id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== user_id) {
      throw new Error('You do not have permission to cancel this appointment.');
    }

    const dataWithSub = subHours(appointment.date, 2);
    // retira 2h do horario do apontamento

    if (isBefore(dataWithSub, new Date())) {
      throw new Error('You can only cancel appointments 2 hours in advance.');
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    // Configurando o envio de email (revisar config/mail.. lib/mail)
    Queue.add(CancellationMain.key, {
      appointment,
    });

    /**
     * Invalidate cache
     */

    // await Cache.invalidatePrefix(`user:${user_id}:appointments`);

    return appointment;
  }
}

export default new CancelAppointmentService();
