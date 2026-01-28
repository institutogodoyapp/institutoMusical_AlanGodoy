import { ConteudoProgramatico } from './conteudoProgramatico'
import { StatusSoft } from '../aluno'

export enum InstrumentoTipo {
    CORDA = 'CORDA',
    SOPRO = 'SOPRO',
    PERCUSSAO = 'PERCUSSAO',
    TECLAS = 'TECLAS',
    VOCAL = 'VOCAL',
    FORMACAO = 'FORMACAO'
    // Adicione outros roles conforme necessário
}


export interface Instrumento {
  id: number;
  nome: string;
  tipo: InstrumentoTipo;
  quantidadeDeAluno?: number;
  ativo?: boolean;
  conteudoProgramatico?: ConteudoProgramatico;
  statusEntity: StatusSoft;
}

export interface InstrumentoCadastro {

  nome: string;
  tipo: InstrumentoTipo;

}

