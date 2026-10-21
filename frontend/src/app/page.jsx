"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

const API = "http://localhost:3000/noticias";

export default function Home() {
  const [noticias, setNoticias] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("Saúde animal");
  const [conteudo, setConteudo] = useState("");
  const [data, setData] = useState("");
  const [editando, setEditando] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function carregarNoticias() {
    try {
      const resposta = await fetch(API);

      if (!resposta.ok) {
        throw new Error("Não foi possível carregar as notícias.");
      }

      const dados = await resposta.json();
      setNoticias(dados);
      setErro("");
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    }
  }

  useEffect(() => {
    carregarNoticias();
  }, []);

  function limparFormulario() {
    setTitulo("");
    setCategoria("Saúde animal");
    setConteudo("");
    setData("");
    setEditando(null);
  }

  async function salvarNoticia(evento) {
    evento.preventDefault();
    setMensagem("");
    setErro("");

    if (!titulo.trim() || !conteudo.trim() || !data || !categoria) {
      setErro("Preencha todos os campos.");
      return;
    }

    const noticia = { titulo, categoria, conteudo, data };
    const endereco = editando ? `${API}/${editando}` : API;
    const metodo = editando ? "PUT" : "POST";

    try {
      const resposta = await fetch(endereco, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noticia),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao salvar a notícia.");
      }

      setMensagem(
        editando
          ? "Notícia atualizada com sucesso!"
          : "Notícia cadastrada com sucesso!"
      );

      limparFormulario();
      await carregarNoticias();
    } catch (erro) {
      setErro(erro.message || "Não foi possível conectar ao servidor.");
    }
  }

  function prepararEdicao(noticia) {
    setTitulo(noticia.titulo);
    setCategoria(noticia.categoria);
    setConteudo(noticia.conteudo);
    setData(noticia.data.slice(0, 10));
    setEditando(noticia.id);
    setMensagem("");
    setErro("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluirNoticia(id) {
    if (!window.confirm("Deseja realmente excluir esta notícia?")) {
      return;
    }

    setMensagem("");
    setErro("");

    try {
      const resposta = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Erro ao excluir a notícia.");
      }

      setMensagem("Notícia excluída com sucesso!");
      await carregarNoticias();
    } catch (erro) {
      setErro(erro.message || "Não foi possível conectar ao servidor.");
    }
  }

  function formatarData(valor) {
    const partes = valor.slice(0, 10).split("-");

    if (partes.length !== 3) return valor;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  return (
    <main className={styles.pagina}>
      <header className={styles.topo}>
        <a href="#" className={styles.logo}>
          <span className={styles.logoIcone}>V</span>
          <span>Vet<span className={styles.logoDestaque}>News</span></span>
        </a>

        <span className={styles.topoTexto}>Informação que cuida</span>
      </header>

      <section className={styles.hero}>
        <span className={styles.etiqueta}>CENTRAL DE NOTÍCIAS</span>
        <h1>Informação para quem ama os animais.</h1>
        <p>
          Cadastre, organize e acompanhe notícias sobre saúde,
          bem-estar e o universo veterinário.
        </p>
      </section>

      <section className={styles.conteudo}>
        <div className={styles.formularioArea}>
          <div className={styles.tituloSecao}>
            <div>
              <span className={styles.pequenoTitulo}>
                {editando ? "EDIÇÃO" : "GERENCIAMENTO"}
              </span>
              <h2>{editando ? "Editar notícia" : "Nova notícia"}</h2>
            </div>
            <span className={styles.iconeFormulario}>✎</span>
          </div>

          <form onSubmit={salvarNoticia} className={styles.formulario}>
            <label htmlFor="titulo">Título da notícia</label>
            <input
              id="titulo"
              value={titulo}
              onChange={(evento) => setTitulo(evento.target.value)}
              placeholder="Ex.: Cuidados com os pets no verão"
              maxLength={120}
              required
            />

            <div className={styles.linhaCampos}>
              <div>
                <label htmlFor="categoria">Categoria</label>
                <select
                  id="categoria"
                  value={categoria}
                  onChange={(evento) => setCategoria(evento.target.value)}
                  required
                >
                  <option>Saúde animal</option>
                  <option>Bem-estar</option>
                  <option>Animais silvestres</option>
                  <option>Prevenção</option>
                  <option>Novidades veterinárias</option>
                </select>
              </div>

              <div>
                <label htmlFor="data">Data da notícia</label>
                <input
                  id="data"
                  type="date"
                  value={data}
                  onChange={(evento) => setData(evento.target.value)}
                  required
                />
              </div>
            </div>

            <label htmlFor="conteudo">Conteúdo</label>
            <textarea
              id="conteudo"
              value={conteudo}
              onChange={(evento) => setConteudo(evento.target.value)}
              placeholder="Escreva o conteúdo da notícia..."
              rows={5}
              maxLength={2000}
              required
            />

            {mensagem && (
              <p className={styles.sucesso}>{mensagem}</p>
            )}

            {erro && <p className={styles.erro}>{erro}</p>}

            <div className={styles.acoesFormulario}>
              <button type="submit" className={styles.botaoPrincipal}>
                {editando ? "Salvar alterações" : "Publicar notícia"}
              </button>

              {editando && (
                <button
                  type="button"
                  className={styles.botaoCancelar}
                  onClick={limparFormulario}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className={styles.listaArea}>
          <div className={styles.tituloSecao}>
            <div>
              <span className={styles.pequenoTitulo}>PUBLICAÇÕES</span>
              <h2>Notícias cadastradas</h2>
            </div>
            <span className={styles.contador}>{noticias.length}</span>
          </div>

          {erro && noticias.length === 0 && (
            <p className={styles.erro}>{erro}</p>
          )}

          {!erro && noticias.length === 0 && (
            <div className={styles.vazio}>
              <span>✧</span>
              <h3>Nenhuma notícia por aqui</h3>
              <p>Cadastre a primeira notícia usando o formulário.</p>
            </div>
          )}

          <div className={styles.listaNoticias}>
            {noticias.map((noticia) => (
              <article className={styles.cardNoticia} key={noticia.id}>
                <div className={styles.cardTopo}>
                  <span className={styles.categoria}>
                    {noticia.categoria}
                  </span>
                  <span className={styles.data}>
                    {formatarData(noticia.data)}
                  </span>
                </div>

                <h3>{noticia.titulo}</h3>
                <p className={styles.resumo}>{noticia.conteudo}</p>

                <div className={styles.acoesCard}>
                  <button
                    type="button"
                    onClick={() => prepararEdicao(noticia)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className={styles.botaoExcluir}
                    onClick={() => excluirNoticia(noticia.id)}
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.rodape}>
        VetNews · Gerenciador de Notícias Veterinárias
      </footer>
    </main>
  );
}
