import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // path onde sera salvo
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
        // cb recebe 1- err(no caso null), 2- para hexadecimal
        // 3- extensao do arquivo enviado
      });
      // salvar nome do arquivo
    },
  }),
};
