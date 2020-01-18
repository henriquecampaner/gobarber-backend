import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    const CheckIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!CheckIsProvider) {
      return res.status(401).json('Only providers can load notifications');
    }
    // checar se e um provider

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    // marcar notificao como lida
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    // busca o id da notificacao via paramentro url e atualiza
    // 1 onde buscar o id
    // 2 o que altera
    // 3 retorna valor atualziado

    return res.json(notification);
  }
}

export default new NotificationController();
