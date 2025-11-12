import { StatusAula, TipoAula } from "@/app/models/escola/aula";

export const determinarTipoAula = (status: string): 'regular' | 'reposicao' => {
  const statusUpper = status.toUpperCase();
  
  // Se começar com "REPOS" ou conter "REPOSIÇÃO", considera como reposição
  if (statusUpper.startsWith('REPOS') || statusUpper.includes('REPOSIÇÃO')) {
    return 'reposicao';
  }
  
  // Todos os outros casos são considerados regulares
  return 'regular';
};

export const mapearStatus = (statusNoformat: string): string => {
  const statusMap: Record<string, string> = {
    'AULA_AGENDADA': 'Aula Agendada',
    'AULA_CONFIRMADA': 'Aula Confirmada',
    'AULA_REALIZADA': 'Aula Realizada',
    'AULA_CANCELADA': 'Aula Cancelada',
    'REPOSICAO_AGENDADA': 'Reposição Agendada',
    'REPOSICAO_CONFIRMADA': 'Reposição Confirmada',
    'REPOSICAO_REALIZADA': 'Reposição Realizada',
    'REPOSICAO_CANCELADA': 'Reposição Cancelada',
  };

  return statusMap[statusNoformat.toUpperCase()] || statusNoformat;
};

// Converter para texto amigável
export const converterTipoAulaParaTexto = (tipo: TipoAula | undefined): string => {
    const conversoes = {
        [TipoAula.AULA_REGULAR]: 'Regular',
        [TipoAula.AULA_REPOSICAO]: 'Reposição',
        [TipoAula.AULA_AVULSA]: 'Avulsa'
    };
    if(!tipo) return ''
    return conversoes[tipo] || 'Tipo Desconhecido';
};
