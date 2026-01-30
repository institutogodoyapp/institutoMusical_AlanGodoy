import { Aluno, StatusSoft } from "..";
import { Instrumento } from "../../instrumentos";
import { Professor } from "../../professor";
import { aula} from "../../aula"
import { ProgressoAluno } from "../progresso";

export enum TipoMatricula{
    REGULAR = 'REGULAR',
    FLEXIVEL = "FLEXIVEL"
}

export interface Matricula {
    id?: number;
    aluno?: Aluno;
    instrumentoId: number;
    professorId: number;
    alunoId?: number;
    professor?: Professor;
    instrumento?: Instrumento;
    tipoMatricula?: TipoMatricula;
    numeroMatricula?: number;
    dataMatricula?: string;
    diaSemanaAula: string;
    ativo?: boolean;
    horarioAula: string;
    statusEntity?: StatusSoft;
    aulas?: aula[];
    progressoAluno?: ProgressoAluno;
}