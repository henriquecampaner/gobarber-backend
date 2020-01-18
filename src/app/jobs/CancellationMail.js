import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail'; // chabve unica
  }

  async handle({ data }) {
    const { appointment } = data;

    console.log('ok fila rodando');


    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Appointment canceled',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(parseISO(appointment.date), "MMM dd 'at' H:mm'h'"),
      },
    });
  }
  // metodo chamado quando
}

export default new CancellationMail();
