import 'dotenv/config';

import express from 'express';
import path from 'path';
import cors from 'cors';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
// importar async error antes das rotas
import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

class App {
  constructor() {
    // sera chamado assim que instanciado
    this.server = express();

    Sentry.init(sentryConfig);
    // inicia o sentry
    this.middlewares();
    this.routes();

    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    // coloca o sentry para handle the errors
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    // para poder acessar as imagens no frontend
  }

  routes() {
    this.server.use(routes);
    // metodo para importar as rotas

    this.server.use(Sentry.Handlers.errorHandler());
    // observa os erros nas rotas
  }

  //
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
    // middleware para tratamento de errors
  }
}
export default new App().server;
