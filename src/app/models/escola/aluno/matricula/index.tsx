import { Aluno, StatusSoft } from "..";
import { Instrumento } from "../../instrumentos";
import { Professor } from "../../professor";
import { aula} from "../../aula"
import { ProgressoAluno } from "../progresso";

export interface Matricula {
    id?: number;
    aluno?: Aluno;
    instrumentoId: number;
    professorId: number;
    alunoId?: number;
    professor?: Professor;
    instrumento?: Instrumento;
    diaSemanaAula: string;
    ativo?: boolean;
    horarioAula: string;
    statusEntity?: StatusSoft;
    aulas?: aula[];
    progressoAluno?: ProgressoAluno;
}