import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert
} from "react-native";
import Card from "../../components/card/card";
import Navbar from "../../components/navbar/navbar";

import config from '../../config';  

const SERVER = `http://${config.SERVER}:${config.PORT}/api`;

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


interface Categoria {
  _id: string;
  tipo: string;
}


const Home = () => {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${SERVER}/produto`);
      const data = await response.json();
      console.log("API response:", data);
      setProdutos(data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Carregando produtos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
      <Navbar />
      <FlatList
        data={produtos}
        renderItem={({ item }: { item: Product }) => <Card product={item} />}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.productsContainer}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    fontFamily:'montserrat',
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 50,
    marginBottom: -20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productsContainer: {
    padding: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default Home;
