import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    // pega orginal name e file name do arquivo enviado
    const file = await File.create({
      name,
      path,
    });
    // cria o arquivo file com os dados acima
    return res.json(file);
  }
}

export default new FileController();
