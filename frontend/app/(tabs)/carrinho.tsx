import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  DeviceEventEmitter
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from '../../config';
import httpService from "../services/httpService";

const server = config.SERVER;
const port = config.PORT;
const url = `http://${server}:${port}/api`;

interface Produto {
  _id: string;
  nome: string;
  valor: number;
  quantidade: number;
  imagem: string;
}

export default function Carrinho() {
  const [carrinho, setCarrinho] = useState<Produto[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [valorTotal, setValorTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  // Carrega o carrinho ao iniciar e configura o listener para atualizações
  useEffect(() => {
    const carregarCarrinho = async () => {
      try {
        // Verificamos a chave correta - deve ser a mesma usada no ProductModal
        const carrinhoJSON = await AsyncStorage.getItem('CarrinhoProdutos');
        
        console.log('Dados brutos do AsyncStorage:', carrinhoJSON);
        
        if (carrinhoJSON) {
          const carrinhoCarregado = JSON.parse(carrinhoJSON);
          
          // Verifica se é um array e se tem itens válidos
          if (Array.isArray(carrinhoCarregado) && carrinhoCarregado.length > 0) {
            // Filtra apenas itens com estrutura válida e garante que todos tenham quantidade
            const carrinhoFiltrado = carrinhoCarregado
              .filter(item => item?._id && item?.nome && item?.valor !== undefined)
              .map(item => ({
                ...item,
                quantidade: item.quantidade || 1  // Garante que cada item tenha quantidade
              }));
            
            console.log('Carrinho filtrado:', carrinhoFiltrado);
            
            if (carrinhoFiltrado.length > 0) {
              setCarrinho(carrinhoFiltrado);
              calcularTotal(carrinhoFiltrado);
            } else {
              console.warn('Carrinho vazio após filtro');
              await AsyncStorage.removeItem('CarrinhoProdutos');
            }
          } else {
            console.warn('Dados do carrinho inválidos');
            await AsyncStorage.removeItem('CarrinhoProdutos');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        // Limpa o storage em caso de erro
        await AsyncStorage.removeItem('CarrinhoProdutos');
        setCarrinho([]);
      }
    };
  
    carregarCarrinho();
    
    // Adiciona um listener para atualizações do carrinho
    const subscription = DeviceEventEmitter.addListener(
      'carrinhoAtualizado',
      (produtosAtualizados) => {
        if (Array.isArray(produtosAtualizados)) {
          // Filtra e formata da mesma maneira que a função carregarCarrinho
          const carrinhoFiltrado = produtosAtualizados
            .filter(item => item?._id && item?.nome && item?.valor !== undefined)
            .map(item => ({
              ...item,
              quantidade: item.quantidade || 1
            }));
          
          if (carrinhoFiltrado.length > 0) {
            setCarrinho(carrinhoFiltrado);
            calcularTotal(carrinhoFiltrado);
          }
        }
      }
    );
    
    // Limpeza do listener quando o componente for desmontado
    return () => {
      subscription.remove();
    };
  }, []);
  
  // Atualiza o valor total quando o carrinho muda
  useEffect(() => {
    calcularTotal(carrinho);
    if (carrinho.length > 0) {
      AsyncStorage.setItem('CarrinhoProdutos', JSON.stringify(carrinho));
    }
  }, [carrinho]);

  const calcularTotal = (itens: Produto[]) => {
    const total = itens.reduce((sum, item) => sum + (item.valor * item.quantidade), 0);
    setValorTotal(total);
  };

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const adicionarQuantidade = (id: string) => {
    setCarrinho(prev => 
      prev.map(item => 
        item._id === id ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  };

  const removerQuantidade = (id: string) => {
    setCarrinho(prev => 
      prev.map(item => {
        if (item._id === id) {
          const novaQuantidade = item.quantidade - 1;
          return novaQuantidade > 0 
            ? { ...item, quantidade: novaQuantidade } 
            : item; // Mantém o item com 1 como mínimo
        }
        return item;
      })
    );
  };

  const removerItem = (id: string) => {
    setCarrinho(prev => {
      const novoCarrinho = prev.filter(item => item._id !== id);
      // Se carrinho ficou vazio, remove do AsyncStorage
      if (novoCarrinho.length === 0) {
        AsyncStorage.removeItem('CarrinhoProdutos');
      }
      return novoCarrinho;
    });
  };

  const handleFinalizarPress = () => {
    if (carrinho.length === 0) {
      Alert.alert("Carrinho Vazio", "Adicione itens antes de finalizar a compra.");
      return;
    }
    setModalVisible(true);
  };

  const finalizarCompra = async () => {
    try {
      // Obtém o ID do cliente
      const clienteID = await AsyncStorage.getItem('ClienteID');
      
      if (!clienteID) {
        Alert.alert("Erro", "Usuário não identificado. Faça login novamente.");
        return;
      }
      
      // Formata os dados conforme esperado pelo backend
      const produtosFormatados = carrinho.map(item => ({
        produto: item._id, // ID do produto
        quantidade: item.quantidade,
        valor: item.valor * item.quantidade // Valor total do item
      }));
      
      // Cria o carrinho no backend com o formato correto
      const data = await httpService.post(`${url}/carrinho`, {
        valor: valorTotal,
        quantidade: carrinho.reduce((total, item) => total + item.quantidade, 0),
        produto: carrinho.map(item => item._id) // Array de IDs dos produtos
      });
      
      // Salva o ID do carrinho
      const responseCarrinhoID = data.carrinho._id;
      // console.log('RESPONSE CARRINHO:', JSON.stringify(responseCarrinho, null, 2));
      // console.log('DATA COMPLETA:', JSON.stringify(data, null, 2));    // Pega o ID do carrinho da resposta, não da operação AsyncStorage
      console.log('CARRINHOIDDDDDD', responseCarrinhoID)
      console.log('CLIENTEIDDDDDD', clienteID)

    // Salva no AsyncStorage se necessário para uso futuro
    await AsyncStorage.setItem("carrinhoID", responseCarrinhoID);
    const carrinhoID = await AsyncStorage.getItem('carrinhoID');
    console.log('carrinhoIDDDDDDDDDDDDDDDDDDDD', carrinhoID)

    const frase = ''
    // Cria o pedido com os IDs corretos
    await httpService.post(`${url}/pedido`, {
      cliente: { _id: clienteID },  // Envia como objeto se o backend esperar
      carrinho: { _id: carrinhoID }, // Envia como objeto se o backend esperar
      frase: frase
    });
      // Limpa o carrinho local
      await AsyncStorage.removeItem('CarrinhoProdutos');
      setCarrinho([]);
      
      Alert.alert("Sucesso!", "Compra finalizada com sucesso!");
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      Alert.alert("Erro", "Não foi possível finalizar a compra.");
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
      </View>

      {/* Botão Menu */}
      <View style={styles.buttonImage}>
        <TouchableOpacity onPress={toggleMenu}>
          <Image
            source={require("../../assets/images/menu.png")}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      </View>

      {/* Fundo escuro ao abrir menu */}
      {menuVisible && (
        <TouchableOpacity 
          style={styles.voltarMenu} 
          onPress={toggleMenu} 
          activeOpacity={1}
        />
      )}

      {/* Menu Lateral */}
      {menuVisible && (
        <View style={styles.sidebar}>
          <Image
            style={styles.menuLogo}
            source={require("../../assets/images/logoEncurtada.png")}
          />
          {[
            "Camisas",
            "Saias",
            "Calças",
            "Sutiãs",
            "Calcinhas",
            "Meias",
            "Cropped",
          ].map((categoria) => (
            <TouchableOpacity
              key={categoria}
              onPress={() => Alert.alert(`Tela ${categoria}`)}
            >
              <Text style={styles.menuItem}>{categoria}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Card do Carrinho */}
      <View style={styles.cardCarrinho}>
        {carrinho.length === 0 ? (
          <Text style={styles.emptyCart}>Seu carrinho está vazio</Text>
        ) : (
          <FlatList
            data={carrinho}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image 
                  source={{ uri: item.imagem }} 
                  style={styles.image} 
                  onError={() => console.log("Erro ao carregar imagem")}
                />
                <View style={styles.info}>
                  <Text style={styles.nome}>{item.nome}</Text>
                  <Text style={styles.valor}>R$ {item.valor.toFixed(2)}</Text>
                  <Text style={styles.subtotal}>
                    Subtotal: R$ {(item.valor * item.quantidade).toFixed(2)}
                  </Text>

                  <View style={styles.quantidadeContainer}>
                    <TouchableOpacity 
                      onPress={() => removerQuantidade(item._id)}
                      style={styles.botaoQuantidade}
                    >
                      <Text style={styles.botaoTexto}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.quantidade}>{item.quantidade}</Text>

                    <TouchableOpacity 
                      onPress={() => adicionarQuantidade(item._id)}
                      style={styles.botaoQuantidade}
                    >
                      <Text style={styles.botaoTexto}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => removerItem(item._id)}
                    style={styles.botaoRemover}
                  >
                    <Text style={styles.botaoRemoverTexto}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.resumoCompra}>
        <Text style={styles.total}>Total: R$ {valorTotal.toFixed(2)}</Text>
        <TouchableOpacity
          onPress={handleFinalizarPress}
          style={[
            styles.botaoFinalizar,
            carrinho.length === 0 && styles.botaoDesabilitado
          ]}
          disabled={carrinho.length === 0}
        >
          <Text style={styles.textoBotao}>Finalizar Compra</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Confirmação */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Deseja realmente finalizar a compra?</Text>
            <Text style={styles.modalSubtext}>Total: R$ {valorTotal.toFixed(2)}</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={finalizarCompra}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    position: "relative",
    paddingBottom: 20,
  },
  navbar: {
    width: "100%",
    height: 150,
    backgroundColor: "#f2f2f2",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "32%",
    marginTop: 20,
    paddingHorizontal: 15,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  emptyCart: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
    marginTop: 50,
  },
  buttonImage: {
    width: 30,
    height: 20,
    marginLeft: 10,
    marginBottom: 10,
  },
  voltarMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 200,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  menuLogo: {
    marginTop: "40%",
    marginLeft: 50,
    width: 60,
    height: 60,
  },
  menuItem: {
    fontSize: 16,
    marginBottom: 15,
    padding: 10,
    marginLeft: 35,
    fontWeight: "500",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "60%",
    backgroundColor: "#fff",
    padding: 20,
    zIndex: 100,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  valor: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  subtotal: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  quantidadeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  botaoQuantidade: {
    backgroundColor: "#ddd",
    borderRadius: 5,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoTexto: {
    fontSize: 20,
    textAlign: 'center',
  },
  quantidade: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  resumoCompra: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  botaoFinalizar: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  botaoDesabilitado: {
    backgroundColor: "#ccc",
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
  botaoRemover: {
    marginTop: 10,
    backgroundColor: "#ff4444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  botaoRemoverTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  cardCarrinho: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    margin: 10,
    maxHeight: 400,
    overflow: "hidden",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtext: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});