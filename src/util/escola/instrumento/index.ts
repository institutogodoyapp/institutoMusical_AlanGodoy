  export const getInstrumentoIcon = (tipo: string) => {
    switch (tipo) {
      case 'CORDA':
        return '/icons/instrumentos.svg';
      case 'SOPRO':
        return '/icons/sopro.svg';
      case 'PERCUSSAO':
        return '/icons/percussão.svg';
      case 'TECLAS':
        return '/icons/teclas.svg';
      case 'VOCAL':
        return '/icons/voz.svg';
      default:
        return '/icons/others.svg';
    }
  };