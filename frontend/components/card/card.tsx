import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import ProductModal from "../modal/modal"; // Importando o modal correto

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

interface Categoria {
  _id: string;
  tipo: string;
}

interface CardProps {
  product: Product;
}

const Card: React.FC<CardProps> = ({ product }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={{ uri: product.imagem }} style={styles.imageProduto} />
          <Text style={styles.atributosProduto}>{product.nome}</Text>
          <Text style={styles.categoriaProduto}>{product.categoria.tipo}</Text>
          <Text style={styles.atributosProduto}>{product.descricao}</Text>
        </TouchableOpacity>

        <ProductModal 
          visible={modalVisible} 
          product={product} 
          onClose={() => setModalVisible(false)} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 265,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
    padding: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    position: "relative",
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
    fontSize: 13,
    textAlign: "justify",
    alignSelf: "flex-start",
  },
  categoriaProduto: {
    color: "#000",
    fontSize: 12,
    marginBottom: 15,
    fontWeight: "900",
    alignSelf: "flex-start",
  },
});

export default Card;
