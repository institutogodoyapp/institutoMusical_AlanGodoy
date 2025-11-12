
import { Aluno } from '@/app/models/escola/aluno'
import { Professor } from '../professor';
import { Reposicao } from '../reposicao';
export enum TipoAula {
    AULA_REGULAR = 'AULA_REGULAR',
    AULA_REPOSICAO = 'AULA_REPOSICAO',
    AULA_AVULSA = 'AULA_AVULSA'
}


export enum StatusAula {
    AGENDADA = 'AGENDADA',
    CONFIRMADA = 'CONFIRMADA',
    REALIZADA = 'REALIZADA',
    CANCELADA = 'CANCELADA',
    REPOSTA = 'REPOSTA'
}

export interface aula {

    id: number;
    aluno: Aluno;
    horarioAula: string;
    horarioInicioComercial: string;
    horarioFimComercial: string;
    horarioPadrao: string;
    diaSemanaAula: string;
    recorrente: boolean;
    professor: Professor;
    dataHora: string;
    duracao: number;
    observacoes: string;
    status: StatusAula;
    reposicao: Reposicao

}

export interface AulaForm {

 
  id: number;
  tipoAula?:TipoAula;
  diaSemanaAula: string;
  dataHora: string;         // Formato "YYYY-MM-DD"
  horarioAula: string;         // Formato "HH:MM"
  duracao: number;      // Em minutos
  alunoNome: string;
  professorNome: string;
  professorId: number;
  observacoes: string;
  instrumentoNome?: string;  // Adicione campos extras conforme necessário
  status: string;
}


export interface AulaFormForm {

 
  id: number;
  tipoAula?:TipoAula;
  diaSemanaAula: string;
  dataHora: string;         // Formato "YYYY-MM-DD"
  horarioAula: string;         // Formato "HH:MM"
  duracao: number;      // Em minutos
  alunoNome: string;
  instrumentoId: number
  alunoNomeAvulso: string;
  professorId: number,
  alunoId: number,
  reposicaoId: number,
  professorNome: string;
  observacoes: string;
  instrumentoNome?: string;  // Adicione campos extras conforme necessário
  status: string;
}

