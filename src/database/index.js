import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointments from '../app/models/Appointments';

const models = [User, File, Appointments];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connections = new Sequelize(databaseConfig);
    // conexao com basededados

    models
      .map(model => model.init(this.connections))
      .map(
        model => model.associate && model.associate(this.connections.models)
      );
    // map que rodar os models para instanciaro init
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
