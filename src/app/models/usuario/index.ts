export enum Role {
  ADMIN = 'ADMIN',
  ALUNO = 'ALUNO',
  PROFESSOR = 'PROFESSOR',
  CLIENTE = 'CLIENTE'
  // Adicione outros roles conforme necessário
}

export interface UsuarioLogin {
  email: string;
  senha: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string; // Omitir em algumas situações por segurança
  endereco: Endereco;
  telefone: string;
  role: Role;
}

export interface Endereco {
  id?: number;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  // Outros campos conforme sua entidade Endereco
}

export interface MudancaSenhaRequest {

  email: string,
  senhaAtual: string,
  novaSenha: string,
  confirmacaoNovaSenha: string,
}

