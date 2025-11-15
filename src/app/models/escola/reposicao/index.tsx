import { aula } from "../aula";

export enum StatusReposicao {
    PENDENTE = 'PENDENTE',       // Solicitação feita, aguardando aprovação
    AGENDADA = 'AGENDADA',       // Reposição agendada
    REALIZADA = 'REALIZADA',      // Reposição concluída
    CANCELADA = 'CANCELADA',      // Reposição cancelada
    NAO_REALIZADA = 'NAO_REALIZADA'   // Reposição não realizada (aluno faltou)
}



export interface Reposicao {
    id: number;
    aula?: aula
    aulaOriginalId: number;
    alunoNome: string;
    novaDataHora: string;
    motivo: string;
    status?: StatusReposicao;
    dataSolicitacao?: string;
    dataHoraAulaOriginal?: string;
};
