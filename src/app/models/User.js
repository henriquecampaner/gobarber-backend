import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        // nao existe na db
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
        // verificado se tem password e pega o password, criptografa e grava no pss_hash
      }
    });
    // sera executado antes de salvar no bd

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }
  // criar relacionamento entre models

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
    // para verificar se a senha bate
  }
}

export default User;
