import express from 'express';
import {
  listar,
  buscar,
  criar,
  editar,
  excluir
} from '../controllers/noticiaController.js';

export default function criarNoticiasRoutes() {
  const router = express.Router();

  router.get('/', listar);
  router.get('/:id', buscar);
  router.post('/', criar);
  router.put('/:id', editar);
  router.delete('/:id', excluir);

  return router;
}
