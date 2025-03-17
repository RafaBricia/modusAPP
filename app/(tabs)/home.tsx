import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList
} from "react-native";
import { useCarrinho } from "@/context/CarrinhoContext";

interface product {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  image: any;
  tamanhos: string;
  valor: string;
}

export default function home() {
  const { adicionarAoCarrinho } = useCarrinho();
  // Array com todos os produtos
  const products = [
    {
      id: "1",
      nome: "Saia de Cetim Branca",
      categoria: "Saias",
      descricao:
        "Saia de cetim branca, elegante e sofisticada, com caimento leve e toque acetinado. Perfeita para compor looks delicados e versáteis.",
      image: require("../../assets/images/produts/saia1.jpg"),
      tamanhos: "P, M, G",
      valor: "R$200,00",
    },
    {
      id: "2",
      nome: "Blusa Azul Marinho",
      categoria: "Camisas",
      descricao:
        "Blusa azul marinho clássica e versátil, com tecido confortável e caimento perfeito. Ideal para compor looks elegantes e casuais.",
      image: require("../../assets/images/produts/camisa.png"),
      tamanhos: "P, M, G",
      valor: "R$250,00",
    },
    {
      id: "3",
      nome: "Calça Alfaiataria Preta",
      categoria: "Calça",
      descricao:
        "Elegante e versátil, a calça de alfaiataria preta possui um corte sofisticado e caimento impecável. Perfeita para compor looks formais e casuais com estilo.",
      image: require("../../assets/images/produts/calca.jpg"),
      tamanhos: "P, M, G",
      valor: "R$300,00",
    },
    {
      id: "4",
      nome: "Cropped Azul Cortininha",
      categoria: "Cropped",
      descricao:
        "Cropped azul no estilo cortininha, com ajuste regulável e design moderno. Ideal para compor looks leves e despojados com um toque de estilo.",
      image: require("../../assets/images/produts/cropped.jpg"),
      tamanhos: "P, M, G",
      valor: "R$150,00",
    },
  ];

  // Estados para controlar o menu lateral (se houver) e o modal do produto
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible(!menuVisible);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<product | null>(null);

  // Abre o modal com os detalhes do produto clicado
  const openModal = (product: product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  // Fecha o modal e limpa o produto selecionado
  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const handleComprar = (produto: product) => {
    adicionarAoCarrinho({ ...produto, quantidade: 1 });
    Alert.alert("Sucesso!", "Item adicionado ao carrinho.");
    closeModal();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.buttonImage}>
        <TouchableOpacity onPress={toggleMenu}>
          <Image
            source={require("../../assets/images/menu.png")}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <TouchableOpacity style={styles.voltarMenu} onPress={toggleMenu} />
      )}

      {/* Menu Lateral Simples */}
      {menuVisible && (
        <View style={styles.sidebar}>
          <Image
            style={styles.menuLogo}
            source={require("../../assets/images/logoEncurtada.png")}
          />
          <TouchableOpacity
            onPress={() => {
              toggleMenu();
              Alert.alert("Tela Camisas");
            }}
          >
            <Text style={styles.menuItem}>Camisas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleMenu();
              Alert.alert("Tela Saias");
            }}
          >
            <Text style={styles.menuItem}>Saias</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleMenu();
              Alert.alert("Tela Calças");
            }}
          >
            <Text style={styles.menuItem}>Calças</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleMenu();
              Alert.alert("Tela Sutiãs");
            }}
          >
            <Text style={styles.menuItem}>Sutiãs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleMenu();
              Alert.alert("Tela Calcinhas");
            }}
          >
            <Text style={styles.menuItem}>Calcinhas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleMenu();
              Alert.alert("Tela Meias");
            }}
          >
            <Text style={styles.menuItem}>Meias</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleMenu();
              Alert.alert("Tela Cropped");
            }}
          >
            <Text style={styles.menuItem}>Cropped</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cards com todos os produtos */}
      <View style={styles.content}>
        {products.map((product) => (
          <View key={product.id} style={styles.card}>
            <TouchableOpacity onPress={() => openModal(product)}>
              <Image style={styles.imageProduto} source={product.image} />
              <Text style={styles.atributosProduto}>{product.nome}</Text>
              <Text style={styles.categoriaProduto}>{product.categoria}</Text>
              <Text style={styles.atributosProduto}>{product.descricao}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Modal Dinâmico para exibir detalhes do produto */}
      {selectedProduct && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image style={styles.imageCard} source={selectedProduct.image} />
              <Text style={styles.atributosCard}>{selectedProduct?.nome}</Text>
              <Text style={styles.categoriaCard}>
                {selectedProduct?.categoria}
              </Text>
              <Text style={styles.atributosCard}>
                {selectedProduct?.descricao}
              </Text>
              <Text style={styles.atributosCard}>
                Tamanhos: {selectedProduct?.tamanhos}
              </Text>
              <Text style={styles.categoriaCard}>
                Valor: {selectedProduct?.valor}
              </Text>

              <View style={styles.botoesModal}>
                <TouchableOpacity
                  style={styles.botaoModal}
                  onPress={() => handleComprar(selectedProduct)}
                >
                  <Text style={styles.textStyle}>Comprar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.botaoModal}
                  onPress={closeModal}
                >
                  <Text style={styles.textStyle}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    position: "relative",
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
  menuLogo: {
    color: "#000",
    fontSize: 20,
    marginBottom: 0,
    marginTop: "40%",
    marginLeft: 50,
    width: 60,
    height: 60,
  },
  menuItem: {
    color: "#000",
    fontSize: 16,
    marginBottom: 15,
    padding: 10,
    marginLeft: 35,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
  },
  card: {
    width: 160,
    height: 265,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
    padding: 5,
  },
  imageProduto: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 15,
    marginTop: 5,
    alignSelf: "center",
  },
  atributosProduto: {
    color: "#000",
    fontSize: 10,
    textAlign: "justify",
    alignSelf: "flex-start",
  },
  categoriaProduto: {
    color: "#000",
    fontSize: 11,
    marginBottom: 15,
    fontWeight: "800",
    alignSelf: "flex-start",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imageCard: {
    width: 100,
    height: 200,
    resizeMode: "contain",
    marginBottom: 15,
    marginTop: 5,
    alignSelf: "center",
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
  },
});
