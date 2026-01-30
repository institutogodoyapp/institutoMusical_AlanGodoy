
import { Instrumento } from '../../instrumentos'
export enum StatusProgresso {
    NAO_INICIADA = "NAO_INICIADA",
    EM_ANDAMENTO = "EM_ANDAMENTO",
    DISCIPLINA_CONCLUIDA = "DISCIPLINA_CONCLUIDA",
    PAUSADA = "PAUSADA"
}

export const statusLabelsProgress = {
    [StatusProgresso.NAO_INICIADA]: "Não Iniciada",
    [StatusProgresso.EM_ANDAMENTO]: "Em Andamento",
    [StatusProgresso.DISCIPLINA_CONCLUIDA]: "Disciplina Concluída",
    [StatusProgresso.PAUSADA]: "Disciplina Pausada"
} as const;


export enum StatusTopico {
    TOPICO_EM_ANDAMENTO = "TOPICO_EM_ANDAMENTO",
    TOPICO_NAO_INICIADO = "TOPICO_NAO_INICIADO",
    TOPICO_CONCLUIDO = "TOPICO_CONCLUIDO"
}

export const statusLabels = {
    [StatusTopico.TOPICO_CONCLUIDO]: "Concluído",
    [StatusTopico.TOPICO_EM_ANDAMENTO]: "Em Andamento",
    [StatusTopico.TOPICO_NAO_INICIADO]: "Não Iniciado"
} as const;


export interface ProgressoAluno {
  id: number;
  alunoId: number;
  alunoNome: string;
  dataInicio: string;
  disciplinas: DisciplinaProgresso[];
  tipoExcedente: string;
  instrumentoNome: string;
  instrumento: Instrumento;
  instrumentoTipo: string;
  instrumentoId: number;
  percentualConclusao: number;
  status?: StatusProgresso;
  ultimaAtualizacao: string;
}

export interface DisciplinaProgresso {
  id: number;
  nome: string;
  completa: boolean;
  concluida: boolean;
  concluidos: number;
  dataConclusao: string | null;
  dataInicio: string | null;
  disciplinaId: number;
  disciplinaNome: string;
  progresso: number;
  status: StatusProgresso;
  topicos: TopicoProgresso[];
  ativo: boolean;
  total: number;
}

export interface TopicoProgresso {
  id: number;
  concluido: boolean;
  dataConclusao: string | null;
  dataInicio: string | null;
   ativo: boolean;
  ordem: number;
  progresso: number;
  status: StatusTopico;
  topicoNome: string;
  topicoId:number;
  ultimaAtualizacao: string;
}
