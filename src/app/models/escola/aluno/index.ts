import { Instrumento } from '@/app/models/escola/instrumentos'
import { Professor } from '@/app/models/escola/professor'
import { Mensalidades  } from '@/app/models/escola/financeiro/mensalidade'

import { aula } from '../aula';

export enum StatusSoft {
    CRIADO = 'CRIADO',
    REATIVADO = 'REATIVADO'
}

export interface Aluno {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    dataCadastro?: string;
     diaSemanaAula: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY'; // Representando os dias da semana como string
    horarioAula: string;
    instrumento?: Instrumento;
    instrumentoNome?: string;
    aulas?: aula[];
    instrumentoId: number;
    professor?: Professor;
    professorId: number;
    mensalidades?: Mensalidades[];
    ativo: boolean;
    statusEntity?: StatusSoft;

}
