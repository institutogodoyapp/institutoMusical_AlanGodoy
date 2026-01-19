import { StatusSoft } from '../../../aluno'
import { Documento } from '../documento';
export interface Topico {
  id: number;
  nome: string;
  ordem: number;
  descricao: string;
  disciplinaId?: number;
  statusEntity: StatusSoft;
  docs: Documento[]
}

export interface TopicoCadastro {
  nome: string;
  ordem: number;
  descricao: string;
  disciplinaId?: number;
}
