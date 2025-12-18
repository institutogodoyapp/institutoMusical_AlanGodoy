import { Instrumento } from '@/app/models/escola/instrumentos'
import { Professor } from '@/app/models/escola/professor'
import { Mensalidades  } from '@/app/models/escola/financeiro/mensalidade'

import { aula } from '../aula';
import { Matricula } from './matricula';

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
    telefoneResponsavel: string;
    valorMensalidade: number;
    vencimentoMensalidade: number;
    dataCadastro?: string;
    mensalidades?: Mensalidades[];
    ativo?: boolean;
    statusEntity?: StatusSoft;
    instrumentos: Matricula[];

}
