import { Instrumento  } from '@/app/models/escola/instrumentos'
import { aula } from '../aula';
import { StatusSoft } from '../aluno'
// Define the Professor interface
export interface Professor {
  id?: number;
  nome: string;
  cpf: string;
  ativo?: boolean
  email: string;
  telefone: string;
  instrumentoId?: number;
  instrumentos?: Instrumento[];
 instrumentosIds: number[];
  aulas?: aula[]; // One-to-many relationship
  statusEntity?: StatusSoft;
}

export interface ProfessorCadastro {
  id?: number;
  nome: string;
  cpf: string;
  email: string;
    ativo?: boolean
  telefone: string;
  instrumentoId?: number;
  instrumentos?: Instrumento[];
 instrumentosIds: number[];
  aulas?: aula[]; // One-to-many relationship
}
