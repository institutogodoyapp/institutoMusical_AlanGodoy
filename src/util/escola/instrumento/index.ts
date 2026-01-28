import { Instrumento, InstrumentoTipo } from "@/app/models";

export const getInstrumentoIcon = (tipo: string) => {
  switch (tipo) {
    case 'CORDA':
      return '/icons/cords.svg';
    case 'SOPRO':
      return '/icons/sopro.svg';
    case 'PERCUSSAO':
      return '/icons/perc.svg';
    case 'TECLAS':
      return '/icons/tecl.svg';
    case 'VOCAL':
      return '/icons/voz.svg';

    case 'FORMACAO':
      return '/icons/others.svg';
    default:
      return '/icons/others.svg';
  }
};


