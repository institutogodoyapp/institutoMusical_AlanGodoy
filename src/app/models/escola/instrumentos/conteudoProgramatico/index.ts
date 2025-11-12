import { Disciplina } from './disciplina'

export interface ConteudoProgramatico {
  id: number;
  instrumentoId: number;
  ativo: boolean;
  disciplinas: Disciplina[];
}


