import React from "react";
import { Modal, TouchableOpacity, StyleSheet, View, Image, Text, Alert } from "react-native";
import { useCarrinho } from "@/context/CarrinhoContext";

interface Categoria {
  _id: string;
  tipo: string;
}

interface Product {
    _id: string;
    nome: string;
    categoria: Categoria;
    descricao: string;
    imagem: string;
    tamanho: string[];  // Alterado para array de strings
    valor: number;
    quantidade: number;
  }
  

interface ProductModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
}

const ProductModal = ({ visible, product, onClose }: ProductModalProps) => {
  const { adicionarAoCarrinho } = useCarrinho();

  const handleComprar = (produto: Product) => {
    const produtoParaCarrinho = {
      _id: produto._id,
      nome: produto.nome,
      categoria: produto.categoria,
      descricao: produto.descricao,
      imagem: produto.imagem,
      tamanho: produto.tamanho,
      valor: produto.valor,
      quantidade: produto.quantidade
    };
  
    adicionarAoCarrinho(produtoParaCarrinho);
    Alert.alert("Sucesso!", "Item adicionado ao carrinho.");
    onClose();
  };
  

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        {product && (
          <View style={styles.modalView}>
            <Image 
              style={styles.imageCard} 
              source={{ uri: product.imagem }}
            />
            <Text style={styles.atributosCard}>{product.nome}</Text>
            <Text style={styles.categoriaCard}>{product.categoria.tipo}</Text>
            <Text style={styles.atributosCard}>{product.descricao}</Text>
            <Text style={styles.valorCard}>{product.valor}</Text>

            <View style={styles.botoesModal}>
              <TouchableOpacity
                style={styles.botaoModal}
                onPress={() => handleComprar(product)}
              >
                <Text style={styles.textStyle}>Comprar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoModal}
                onPress={onClose}
              >
                <Text style={styles.textStyle}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  imageCard: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 15,
  },
  valorCard: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  atributosCard: {
    color: "#000",
    fontSize: 16,
    marginTop: 8,
    textAlign: "justify",
    alignSelf: "flex-start",
  },
  categoriaCard: {
    color: "#000",
    fontSize: 16,
    marginBottom: 15,
    marginTop: 10,
    fontWeight: "800",
    alignSelf: "flex-start",
  },
  botoesModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  botaoModal: {
    backgroundColor: "#000",
    borderRadius: 10,
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 15,
    paddingTop: 15,
    marginTop: 10,
  },
  textStyle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  }
});

export default ProductModal;
