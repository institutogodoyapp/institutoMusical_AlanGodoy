

    export interface CategoriaServico {
        id: number;
        nome: string;
        descricao: string;
        ativo: boolean
          dataCriacao: string;
          servicosCount: number;
          comServico:boolean
    }

       export interface CategoriaServicoForm {
        id: number;
        nome: string;
        descricao: string;    
    }