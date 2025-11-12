// @/app/models/escola/config-agenda.ts
export interface ConfigAgenda {
  horaInicio: string;
  horaFim: string;
  duracaoAulaMinutos: number;
}

export enum DiaSemana {
  SEGUNDA = 1,
  TERCA = 2,
  QUARTA = 3,
  QUINTA = 4,
  SEXTA = 5,
  SABADO = 6
}

export const DIAS_SEMANA = [
  { valor: 1, label: 'Segunda' },
  { valor: 2, label: 'Terça' },
  { valor: 3, label: 'Quarta' },
  { valor: 4, label: 'Quinta' },
  { valor: 5, label: 'Sexta' },
  { valor: 6, label: 'Sábado' }
];