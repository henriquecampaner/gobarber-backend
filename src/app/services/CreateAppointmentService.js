import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import User from '../models/User';
import Appointments from '../models/Appointments';

import Notification from '../schemas/Notification';

import Cache from '../../lib/Cache';

class CreateAppointmentService {
  async run({ provider_id, user_id, date }) {
    // Check if provider_id is a provider
    const CheckIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!CheckIsProvider) {
      throw new Error('You can only create appointments with providers');
    }

    // Checar se e eles msm marcando appointment

    const ProviderToHimSelf = user_id;

    if (ProviderToHimSelf === CheckIsProvider.id) {
      throw new Error('You can not create an appointment for youserlf');
    }

    // check if the date has passed

    const hourStart = startOfHour(parseISO(date));
    // transforma a data do que req em formato Js

    if (isBefore(hourStart, new Date())) {
      throw new Error('Past dates are not permitted');
    }

    // check if date is available

    const checkAvailability = await Appointments.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      throw new Error('Appointment date is not available');
    }

    const appointment = await Appointments.create({
      user_id,
      provider_id,
      date: hourStart,
    });

    // Notify appointment provider with mongodb

    const user = await User.findByPk(user_id);
    const formattedDate = format(hourStart, "MMM dd 'at' H:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `New appointment from ${user.name} to ${formattedDate} `,
      user: provider_id,
    });

    /**
     * Invalidate cache
     */

    // await Cache.invalidatePrefix(`user:${user_id}:appointments`);

    return appointment;
  }
}

export default new CreateAppointmentService();
