const mongoose = require('mongoose');
const Questao = mongoose.model('Questao');
const ListaExercicio = mongoose.model('ListaExercicio');
const Sugestao = mongoose.model('Sugestao');
const Submissao = mongoose.model('Submissao');

exports.index = async (req, res) => {
  const questoes = await Questao.find({});
  const listasExercicio = await ListaExercicio.find({});
  const tags = await Questao.find().distinct('tags');
  if (req.user) {
    const submissoesUsuario = await Submissao.aggregate([
      {
        $match:
        {
          user: { $eq: req.user._id }
        }
      },
      {
        $group: {
          _id: "$questao",
          count: { $sum: 1 }
        }
      }
    ]);
    const submissoes = new Map(submissoesUsuario.map(sub => [sub._id.toString(), sub.count]));
    res.render('index', { title: 'Início', questoes, listasExercicio, tags, submissoes });
  } else {
    res.render('index', { title: 'Início', questoes, listasExercicio, tags });
  }
};

exports.sugestao = async (req, res) => {
  const sugestao = new Sugestao(req.body);
  await sugestao.save();
  res.status(200).send('Submissão enviada com sucesso');
};