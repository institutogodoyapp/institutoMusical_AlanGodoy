export const getDataAtual = () => {
  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexado
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

export const adicionarDias = (dataString: string, dias: number): string => {
  const data = new Date(dataString);
  data.setDate(data.getDate() + dias);
  
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  
  return `${ano}-${mes}-${dia}`;
};

export function extrairData(dataHora: string): string {
  // Suporta tanto espaço quanto "T" como separador
  if (!dataHora) return '';
  const [data] = dataHora.split(/[ T]/);
  return data;
}

export const parseApiDate = (dateTimeStr: string): Date | null => {
    if (!dateTimeStr) return null;
    
    try {
        const [fullDate, time] = dateTimeStr.split(' ');
        const [day, month, year] = fullDate.split('/').map(Number);
        const [hours, mins] = time.split(':').map(Number);
        
        // Validação básica dos valores
        if (isNaN(day) || isNaN(month) || isNaN(year) || 
            isNaN(hours) || isNaN(mins)) {
            return null;
        }
        
        return new Date(year, month - 1, day, hours, mins);
    } catch (error) {
        console.error('Erro ao parsear data:', error);
        return null;
    }
};

export function formatarDataString(dataString: string) {
    const data = new Date(dataString);
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${dia}/${mes}/${ano}`;
}

export const converterDataParaInput = (dataString: string): string => {
  if (!dataString) return '';
  
  // Se já estiver no formato YYYY-MM-DD, retorna direto
  if (dataString.includes('-')) return dataString.split('T')[0];
  
  // Converte de DD/MM/YYYY para YYYY-MM-DD
  if (dataString.includes('/')) {
    const [dia, mes, ano] = dataString.split('/');
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }
  
  return '';
};



