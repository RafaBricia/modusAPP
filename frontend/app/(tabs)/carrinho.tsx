// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
//   Alert,
// } from "react-native";
// import { useCarrinho } from "@/context/CarrinhoContext";
// import httpService from "../services/httpService";
// import config from '../../config'
// import { router } from "expo-router";

// const server = `${config.SERVER}`;
// const port = `${config.PORT}`;

// const url = `http://${server}:${port}/api`

// export default function Carrinho() {
//   const { carrinho, adicionarAoCarrinho, setCarrinho, removerDoCarrinho } =
//     useCarrinho();
//   const [valorTotal, setValorTotal] = useState(false);
//   const [menuVisible, setMenuVisible] = useState(false);

//   const toggleMenu = () => setMenuVisible(!menuVisible);

//   const getCarrinho = async () => {
//     const response = await httpService.get(`${url}/carrinho`);
//     return response.data.map(car => ({
//       id: car._id,
//       quantidade: car.quantidade,
//       valor: car.valor,
//       produto: car.produto,
//       cliente: car.cliente
//     }));
//   };

//   const finalizarCompra = () => {

//     if (carrinho.length === 0) {
//       Alert.alert(
//         "Carrinho Vazio",
//         "Adicione itens antes de finalizar a compra."
//       );
//       return;
//     }
//     // criar rota
//     router.replace('/pagamento')

//     Alert.alert("Sua Compra está quase finalizada!", "Escolha seu método de pagamento");
//     // setCompraFinalizada(true);
//   };

//   const removerItemDoCarrinho = (id: string) => {
//     Alert.alert(
//       "Remover item",
//       "Tem certeza que deseja remover este item do carrinho?",
//       [
//         { text: "Cancelar", style: "cancel" },
//         {
//           text: "Remover",
//           style: "destructive",
//           onPress: () => {
//             const novoCarrinho = carrinho.filter((item) => item._id !== id);
//             setCarrinho(novoCarrinho);
//           },
//         },
//       ]
//     );
//   };


//   return (
//     <View style={styles.container}>
//       {/* Navbar */}
//       <View style={styles.navbar}>
//         <Image
//           source={require("../../assets/images/logo.png")}
//           style={styles.logo}
//         />
//       </View>

//       {/* Botão Menu */}
//       <View style={styles.buttonImage}>
//         <TouchableOpacity onPress={toggleMenu}>
//           <Image
//             source={require("../../assets/images/menu.png")}
//             style={styles.buttonImage}
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Fundo escuro ao abrir menu */}
//       {menuVisible && (
//         <TouchableOpacity style={styles.voltarMenu} onPress={toggleMenu} />
//       )}

//       {/* Menu Lateral */}
//       {menuVisible && (
//         <View style={styles.sidebar}>
//           <Image
//             style={styles.menuLogo}
//             source={require("../../assets/images/logoEncurtada.png")}
//           />
//           {[
//             "Camisas",
//             "Saias",
//             "Calças",
//             "Sutiãs",
//             "Calcinhas",
//             "Meias",
//             "Cropped",
//           ].map((categoria) => (
//             <TouchableOpacity
//               key={categoria}
//               onPress={() => Alert.alert(`Tela ${categoria}`)}
//             >
//               <Text style={styles.menuItem}>{categoria}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}

//       {/* Card do Carrinho */}
//       <View style={styles.cardCarrinho}>
//         {carrinho.length === 0 ? (
//           <Text style={styles.emptyCart}>Seu carrinho está vazio</Text>
//         ) : (
//           <>
//             <FlatList
//               data={carrinho}
//               keyExtractor={(item) => item._id}
//               renderItem={({ item }) => (
//                 <View style={styles.card}>
//                   <Image source={item.imagem} style={styles.image} />
//                   <View style={styles.info}>
//                     <Text style={styles.nome}>{item.nome}</Text>
//                     <Text style={styles.valor}>{item.valor}</Text>

//                     {/* Controles de Quantidade */}
//                     <View style={styles.quantidadeContainer}>
//                       <TouchableOpacity
//                         onPress={() => {
//                           if (item.quantidade > 1) {
//                             removerDoCarrinho(item._id); // Reduz a quantidade
//                           } else {
//                             removerItemDoCarrinho(item._id); // Remove o item
//                           }
//                         }}
//                       >
//                         <Text style={styles.botao}>-</Text>
//                       </TouchableOpacity>

//                       <Text style={styles.quantidade}>{item.quantidade}</Text>

//                       <TouchableOpacity
//                         onPress={() => adicionarAoCarrinho(item)}
//                       >
//                         <Text style={styles.botao}>+</Text>
//                       </TouchableOpacity>
//                     </View>

//                     {/* Botão Remover */}
//                     <TouchableOpacity
//                       onPress={() => removerItemDoCarrinho(item._id)}
//                       style={styles.botaoRemover}
//                     >
//                       <Text style={styles.botao}>Remover</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               )}
//             />

//             {/* Total e Finalizar Compra */}
//           </>
//         )}
//       </View>
//       <View style={styles.resumoCompra}>
//         <Text style={styles.total}>kkkkkk</Text>
//         <TouchableOpacity
//           onPress={finalizarCompra}
//           style={styles.botaoFinalizar}
//         >
//           <Text style={styles.textoBotao}>Finalizar Compra</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// /* Estilos */
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f2f2f2",
//     position: "relative",
//     paddingBottom: 20,
//   },
//   navbar: {
//     width: "100%",
//     height: 150,
//     backgroundColor: "#f2f2f2",
//     flexDirection: "row",
//     alignItems: "center",
//     marginLeft: "32%",
//     marginTop: 20,
//     paddingHorizontal: 15,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     resizeMode: "contain",
//   },
//   emptyCart: {
//     textAlign: "center",
//     fontSize: 18,
//     color: "#888",
//     marginTop: 50,
//   },
//   buttonImage: {
//     width: 30,
//     height: 20,
//     marginLeft: 10,
//     marginBottom: 10,
//   },
//   voltarMenu: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 200,
//     right: 0,
//   },
//   menuLogo: {
//     marginTop: "40%",
//     marginLeft: 50,
//     width: 60,
//     height: 60,
//   },
//   menuItem: {
//     fontSize: 16,
//     marginBottom: 15,
//     padding: 10,
//     marginLeft: 35,
//     fontWeight: "500",
//   },
//   sidebar: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     width: "60%",
//     backgroundColor: "#fff",
//     padding: 20,
//     zIndex: 100,
//   },
//   card: {
//     flexDirection: "row",
//     backgroundColor: "#f9f9f9",
//     padding: 40,
//     borderRadius: 10,
//     marginBottom: 10,
//     alignItems: "center",
//     width: "100%",
//   },
//   image: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//   },
//   info: {
//     flex: 1,
//     marginLeft: 15,
//     justifyContent: "center",
//   },
//   nome: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   valor: {
//     fontSize: 14,
//     color: "#555",
//   },
//   quantidadeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   botao: {
//     fontSize: 20,
//     paddingHorizontal: 10,
//     backgroundColor: "#ddd",
//     borderRadius: 5,
//     marginHorizontal: 5,
//   },
//   quantidade: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   resumoCompra: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 20,
//     marginHorizontal: 20,
//   },
//   total: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   botaoFinalizar: {
//     backgroundColor: "#000",
//     padding: 12,
//     borderRadius: 8,
//     width: "100%",
//     alignItems: "center",
//   },
//   textoBotao: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   botaoRemover: {
//     marginTop: 10,
//     backgroundColor: "#ddd",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 5,
//     alignSelf: "flex-start",
//   },
//   cardCarrinho: {
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 5, // Sombras no Android
//     margin: 10,
//     maxHeight: 400, // Ajuste conforme necessário
//     overflow: "hidden",
//     marginBottom: 10,
//   },
// });


















import React, { useState, useEffect } from "react";
import { Modal, TouchableOpacity, StyleSheet, View, Image, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import httpService from "@/app/services/httpService";
import config from '../../config';

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
  const [carrinho, setCarrinho] = useState<Product[]>([]);

  useEffect(() => {
    const carregarCarrinho = async () => {
      const carrinhoSalvo = await AsyncStorage.getItem("carrinho");
      if (carrinhoSalvo) {
        setCarrinho(JSON.parse(carrinhoSalvo));
      }
    };
    carregarCarrinho();
  }, []);

  const salvarCarrinho = async (novoCarrinho: Product[]) => {
    setCarrinho(novoCarrinho);
    await AsyncStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
  };

  const handleComprar = async (produto: Product) => {
    const produtoParaCarrinho = {
      _id: produto._id,
      quantidade: produto.quantidade,
    };

    try {
      const response = await httpService.post(`${url}/carrinho`, produtoParaCarrinho);
      const novoCarrinho = [...carrinho, produto];
      salvarCarrinho(novoCarrinho);
      Alert.alert("Sucesso!", `Item adicionado ao carrinho.\n${response}`);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar ao carrinho.");
    }
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        {product && (
          <View style={styles.modalView}>
            <Image style={styles.imageCard} source={{ uri: product.imagem }} />
            <Text style={styles.atributosCard}>{product.nome}</Text>
            <Text style={styles.categoriaCard}>{product.categoria.tipo}</Text>
            <Text style={styles.atributosCard}>{product.descricao}</Text>
            <Text style={styles.valorCard}>{product.valor}</Text>

            <View style={styles.botoesModal}>
              <TouchableOpacity style={styles.botaoModal} onPress={() => handleComprar(product)}>
                <Text style={styles.textStyle}>Comprar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoModal} onPress={onClose}>
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
  },
});

export default ProductModal;