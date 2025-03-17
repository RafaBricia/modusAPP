import React, { createContext, useContext, useState, ReactNode } from "react";

// Definição da interface do Produto
interface Produto {
  quantidade: number;
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  image: any;
  tamanhos: string;
  valor: string;
}

// Interface do Contexto do Carrinho
interface CarrinhoContextData {
  carrinho: Produto[];
  adicionarAoCarrinho: (produto: Produto) => void;
  removerDoCarrinho: (id: string) => void;
  removerItemDoCarrinho: (id: string) => void;
  setCarrinho: React.Dispatch<React.SetStateAction<Produto[]>>;
}

// Criando o contexto
const CarrinhoContext = createContext<CarrinhoContextData | undefined>(undefined);

// **PROVIDER DO CARRINHO**
export const CarrinhoProvider = ({ children }: { children: ReactNode }) => {
  const [carrinho, setCarrinho] = useState<Produto[]>([]);

  // Adicionar produto ao carrinho
  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho((prevCarrinho) => {
      const produtoExistente = prevCarrinho.find((item) => item.id === produto.id);

      if (produtoExistente) {
        return prevCarrinho.map((item) =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      } else {
        return [...prevCarrinho, { ...produto, quantidade: 1 }];
      }
    });
  };

  // **Remover um item por clique (-)**
  const removerDoCarrinho = (id: string) => {
    setCarrinho((prevCarrinho) => {
      return prevCarrinho
        .map((item) =>
          item.id === id
            ? { ...item, quantidade: item.quantidade - 1 } // Reduz a quantidade
            : item
        )
        .filter((item) => item.quantidade > 0); // Só remove se a quantidade for 0
    });
  };

  // **Remover completamente o item do carrinho**
  const removerItemDoCarrinho = (id: string) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((item) => item.id !== id));
  };

  return (
    <CarrinhoContext.Provider
      value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho, removerItemDoCarrinho, setCarrinho }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

// **Hook para usar o contexto**
export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error("useCarrinho deve ser usado dentro de um CarrinhoProvider");
  }
  return context;
};