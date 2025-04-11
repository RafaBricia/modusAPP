import React from "react";
import { 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  View, 
  Image, 
  Text, 
  Alert,
  DeviceEventEmitter 
} from "react-native";
import httpService from "@/app/services/httpService";
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  tamanho: string[];
  valor: number;
  quantidade: number;
}

interface ProductModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
}

const server = `${config.SERVER}`;
const port = `${config.PORT}`;
const url = `http://${server}:${port}/api`;

const ProductModal = ({ visible, product, onClose }: ProductModalProps) => {
  
  const listaProdutos = async (produto: Product) => {
    try {
      // Verificar se já existem produtos no AsyncStorage
      const produtosExistentes = await AsyncStorage.getItem('CarrinhoProdutos');
      let produtosArray: Product[] = [];
      
      if (produtosExistentes) {
        produtosArray = JSON.parse(produtosExistentes);
        // Verificar se o array é válido
        if (!Array.isArray(produtosArray)) {
          produtosArray = [];
        }
      }
      
      // Verificar se o produto já existe no carrinho
      const produtoExistente = produtosArray.find(item => item._id === produto._id);
      
      if (produtoExistente) {
        // Se já existe, apenas incrementa a quantidade
        produtoExistente.quantidade = (produtoExistente.quantidade || 1) + 1;
      } else {
        // Se não existe, adiciona com quantidade 1
        const produtoParaCarrinho = {
          ...produto,
          quantidade: 1  // Garantir que sempre tenha quantidade
        };
        produtosArray.push(produtoParaCarrinho);
      }
      
      // Salvar o array atualizado
      await AsyncStorage.setItem('CarrinhoProdutos', JSON.stringify(produtosArray));
      
      // Emitir evento para notificar o componente Carrinho
      DeviceEventEmitter.emit('carrinhoAtualizado', produtosArray);
      
      Alert.alert("Sucesso!", "Produto adicionado ao carrinho!");
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      Alert.alert("Erro", "Falha ao adicionar produto");
    }
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
            <Text style={styles.valorCard}>Valor: R$ {product.valor}</Text>

            <View style={styles.botoesModal}>
              <TouchableOpacity
                style={styles.botaoModal}
                activeOpacity={0.7}
                onPress={() => listaProdutos(product)}
              >
                <Text style={styles.textStyle}>Comprar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoModal}
                activeOpacity={0.7}
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
    width: "90%",
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
    paddingHorizontal: 25,
    paddingVertical: 15,
    marginTop: 10,
  },
  textStyle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  }
});

export default ProductModal;