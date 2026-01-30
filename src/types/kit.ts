export type KitItem = {
  produtoId: string;
  produtoNome: string;
  quantidade: number;
};

export type Kit = {
  // Firestore
  id: string;

  // Flutter (já existe no banco)
  nome: string;
  preco?: number;
  itens?: KitItem[];
  fotoUrl?: string;
  fotoPublicId?: string;

  // Site (vamos adicionar sem quebrar o Flutter)
  descricao?: string;
  codigo?: string;        // ex: KIT-001
  ativo?: boolean;        // vitrine pública
  ordem?: number;         // ordenação manual
  createdAt?: any;
};
