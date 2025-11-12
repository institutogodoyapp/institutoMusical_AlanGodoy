import { Topico } from '../topico'
import { StatusSoft } from '../../../aluno'

export interface Disciplina {
  id: number;
  nome: string;
  descricao: string;
  ordem: number;
  conteudoId: number;
  instrumentoId: number;
  topicos: Topico[];
  statusEntity: StatusSoft;
}

export interface DisciplinaCadastro {
  nome: string;
  descricao: string;
  ordem: number;
  instrumentoId?: number;
  topicos?: Topico[];
  ativo?: boolean;
}
