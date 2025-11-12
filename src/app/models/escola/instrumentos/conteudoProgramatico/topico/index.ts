import { StatusSoft } from '../../../aluno'
export interface Topico {
  id: number;
  nome: string;
  ordem: number;
  descricao: string;
  disciplinaId?: number;
    statusEntity: StatusSoft;
}

export interface TopicoCadastro {
  nome: string;
  ordem: number;
  descricao: string;
  disciplinaId?: number;
}
