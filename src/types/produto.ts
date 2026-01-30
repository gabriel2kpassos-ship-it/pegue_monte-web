export type Produto = {
  id: string;

  // Flutter (já existe no banco)
  nome: string;
  quantidade?: number;
  fotoUrl?: string;
  fotoPublicId?: string;

  // Site (vamos adicionar sem quebrar o Flutter)
  descricao?: string;
  codigo?: string;        // ex: PRO-001
  ativo?: boolean;
  ordem?: number;
  createdAt?: any;
};
