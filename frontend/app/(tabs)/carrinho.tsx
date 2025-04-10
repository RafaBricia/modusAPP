import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { useCarrinho } from "@/context/CarrinhoContext";
import httpService from "../services/httpService";
import config from '../../config'
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


const server = `${config.SERVER}`;
const port = `${config.PORT}`;

const url = `http://${server}:${port}/api`

export default function Carrinho() {
  const { carrinho, adicionarAoCarrinho, setCarrinho, removerDoCarrinho } =
  useCarrinho();
  // const [valorTotal, setValorTotal] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  
  
  useEffect(() => {
    getCarrinho()
  }, [])
  
  
  const toggleMenu = () => setMenuVisible(!menuVisible);
  
  const getCarrinho = async () => {

    const carrinhoID = AsyncStorage.getItem('carrinhoID')

    const {carrinho} = await httpService.get(`${url}/carrinho/${carrinhoID}`);
    return carrinho.map((car:any) => ({
      id: car._id,
      quantidade: car.quantidade,
      valor: car.valor,
      produto: car.produto,
    }));

    // setValorTotal(response.data.valor)
  };

  const finalizarCompra = async() => {

    if (carrinho.length === 0) {
      Alert.alert(
        "Carrinho Vazio",
        "Adicione itens antes de finalizar a compra."
      );
      return;
    }

    const clienteID = AsyncStorage.getItem('userID')
    const carrinhoID = AsyncStorage.getItem('carrinhoID')

    const data = {
      cliente: clienteID,
      carrinho: carrinhoID
    }

    const responsePedido = await httpService.post(`${url}/pedido`, data)

    Alert.alert(`RESPONSE - PEDIDO:${responsePedido}`)
    Alert.alert("Sua Compra finalizada!");
    // setCompraFinalizada(true);
  };

  const removerItemDoCarrinho = (id: string) => {
    Alert.alert(
      "Remover item",
      "Tem certeza que deseja remover este item do carrinho?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            const novoCarrinho = carrinho.filter((item) => item._id !== id);
            setCarrinho(novoCarrinho);
          },
        },
      ]
    );
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
        <TouchableOpacity style={styles.voltarMenu} onPress={toggleMenu} />
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
          <>
            <FlatList
              data={carrinho}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Image source={{ uri: item.imagem }} style={styles.image} />
                  <View style={styles.info}>
                    <Text style={styles.nome}>{item.nome}</Text>
                    <Text style={styles.valor}>{item.valor}</Text>

                    {/* Controles de Quantidade */}
                    <View style={styles.quantidadeContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          if (item.quantidade > 1) {
                            removerDoCarrinho(item._id); // Reduz a quantidade
                          } else {
                            removerItemDoCarrinho(item._id); // Remove o item
                          }
                        }}
                      >
                        <Text style={styles.botao}>-</Text>
                      </TouchableOpacity>

                      <Text style={styles.quantidade}>{item.quantidade}</Text>

                      <TouchableOpacity
                        onPress={() => adicionarAoCarrinho(item)}
                      >
                        <Text style={styles.botao}>+</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Botão Remover */}
                    <TouchableOpacity
                      onPress={() => removerItemDoCarrinho(item._id)}
                      style={styles.botaoRemover}
                    >
                      <Text style={styles.botao}>Remover</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />

            {/* Total e Finalizar Compra */}
          </>
        )}
      </View>
      <View style={styles.resumoCompra}>
        <Text style={styles.total}>kkkkkk</Text>
        <TouchableOpacity
          onPress={finalizarCompra}
          style={styles.botaoFinalizar}
        >
          <Text style={styles.textoBotao}>Finalizar Compra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* Estilos */
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
    padding: 40,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
  },
  valor: {
    fontSize: 14,
    color: "#555",
  },
  quantidadeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  botao: {
    fontSize: 20,
    paddingHorizontal: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantidade: {
    fontSize: 16,
    fontWeight: "bold",
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
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
  botaoRemover: {
    marginTop: 10,
    backgroundColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  cardCarrinho: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Sombras no Android
    margin: 10,
    maxHeight: 400, // Ajuste conforme necessário
    overflow: "hidden",
    marginBottom: 10,
  },
});