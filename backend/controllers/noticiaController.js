let noticias = [];
let proximoId = 1;

export function listar(req, res) {
  res.json(noticias);
}

export function buscar(req, res) {
  const id = Number(req.params.id);
  const noticia = noticias.find((item) => item.id === id);

  if (!noticia) {
    return res.status(404).json({ mensagem: "Notícia não encontrada." });
  }

  res.json(noticia);
}

export function criar(req, res) {
  const { titulo, categoria, conteudo, data } = req.body;
 
  if (!titulo?.trim() || !categoria || !conteudo?.trim() || !data) {
    return res.status(400).json({ mensagem: "Preencha todos os campos." });
  }

  const noticia = {
    id: proximoId++,
    titulo: titulo.trim(),
    categoria,
    conteudo: conteudo.trim(),
    data
  };

  noticias.push(noticia);
  res.status(201).json(noticia);
}

export function editar(req, res) {
  const id = Number(req.params.id);
  const { titulo, categoria, conteudo, data } = req.body;

  if (!titulo?.trim() || !categoria || !conteudo?.trim() || !data) {
    return res.status(400).json({ mensagem: "Preencha todos os campos." });
  }

  const noticia = noticias.find((item) => item.id === id);

  if (!noticia) {
    return res.status(404).json({ mensagem: "Notícia não encontrada." });
  }

  noticia.titulo = titulo.trim();
  noticia.categoria = categoria;
  noticia.conteudo = conteudo.trim();
  noticia.data = data;

  res.json(noticia);
}

export function excluir(req, res) {
  const id = Number(req.params.id);
  const noticia = noticias.find((item) => item.id === id);

  if (!noticia) {
    return res.status(404).json({ mensagem: "Notícia não encontrada." });
  }

  noticias = noticias.filter((item) => item.id !== id);
  res.json({ mensagem: "Notícia excluída com sucesso." });
}