import { useState } from 'react';
import { Image, Text, StyleSheet, View, Alert, TouchableOpacity, ScrollView } from 'react-native';

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <ScrollView style={styles.container}>
      
      {/* Navbar */}
      <View style={styles.navbar}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.buttonImage}>
        <TouchableOpacity onPress={toggleMenu}>
          <Image source={require('../../assets/images/menu.png')} style={styles.buttonImage} />
        </TouchableOpacity>     
      </View>

      {menuVisible && (
        <TouchableOpacity style={styles.voltarMenu} onPress={toggleMenu} />
      )}

      {/* Menu Lateral Simples */}
      {menuVisible && (
        <View style={styles.sidebar}>
          <Image style={styles.menuLogo} source={require('../../assets/images/logoEncurtada.png')} />
          <TouchableOpacity onPress={() => { toggleMenu(); Alert.alert('Tela Camisas'); }}>
            <Text style={styles.menuItem}>Camisas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { toggleMenu(); Alert.alert('Tela Saias'); }}>
            <Text style={styles.menuItem}>Saias</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { toggleMenu(); Alert.alert('Tela Calças'); }}>
            <Text style={styles.menuItem}>Calças</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { toggleMenu(); Alert.alert('Tela Sutiãs'); }}>
            <Text style={styles.menuItem}>Sutiãs</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { toggleMenu(); Alert.alert('Tela Calcinhas'); }}>
            <Text style={styles.menuItem}>Calcinhas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { toggleMenu(); Alert.alert('Tela Meias'); }}>
            <Text style={styles.menuItem}>Meias</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { toggleMenu(); Alert.alert('Tela Cropped'); }}>
            <Text style={styles.menuItem}>Cropped</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Conteúdo da tela */}
      <View style={styles.content}>
        <View style={styles.card}>

          <Image style={styles.imageCard} source={require('../../assets/images/produts/saia1.jpg')} />
          <Text style={styles.tituloEDescricaoProduto} >Saia de Cetim branca</Text>
          <Text style={styles.categoriaProduto}>Saias</Text>
          <Text style={styles.tituloEDescricaoProduto} >Saia de cetim branca, elegante e sofisticada, com caimento leve e toque acetinado. Perfeita para compor looks delicados e versáteis.</Text>
      
        </View>
        <View style={styles.card}>

          <Image style={styles.imageCard} source={require('../../assets/images/produts/camisa.png')} />
          <Text style={styles.tituloEDescricaoProduto} >Blusa Azul Marinho</Text>
          <Text style={styles.categoriaProduto}>Camisas</Text>
          <Text style={styles.tituloEDescricaoProduto} >Blusa azul marinho clássica e versátil, com tecido confortável e caimento perfeito. Ideal para compor looks elegantes e casuais.</Text>
      
        </View>
        <View style={styles.card}>

          <Image style={styles.imageCard} source={require('../../assets/images/produts/calca.jpg')} />
          <Text style={styles.tituloEDescricaoProduto} >Calça Alfaiataria Preta</Text>
          <Text style={styles.categoriaProduto}>Calça</Text>
          <Text style={styles.tituloEDescricaoProduto} >Elegante e versátil, a calça de alfaiataria preta possui um corte sofisticado e caimento impecável. Perfeita para compor looks formais e casuais com estilo.</Text>
        
        </View>
        <View style={styles.card}>

          <Image style={styles.imageCard} source={require('../../assets/images/produts/cropped.jpg')} />
          <Text style={styles.tituloEDescricaoProduto} >Cropped Azul Cortininha</Text>
          <Text style={styles.categoriaProduto}>Cropped</Text>
          <Text style={styles.tituloEDescricaoProduto} >Cropped azul no estilo cortininha, com ajuste regulável e design moderno. Ideal para compor looks leves e despojados com um toque de estilo.</Text>
        
        </View>
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    position: 'relative',
  },
  navbar: {
    width: '100%',
    height: 150,
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '32%',
    marginTop: 20,
    paddingHorizontal: 15,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain'
  },
  buttonImage: {
    width: 30,
    height: 20,
    marginLeft: 10,
    marginBottom:10
  },
  voltarMenu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 200,
    right: 0,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '60%',
    backgroundColor: '#fff',
    padding: 20,
    zIndex: 100,
  },
  menuLogo: {
    color: '#000',
    fontSize: 20,
    marginBottom: 0,
    marginTop: '40%',
    marginLeft: 50,
    width: 60,
    height: 60,
  },
  menuItem: {
    color: '#000',
    fontSize: 16,
    marginBottom: 15,
    padding: 10,
    marginLeft: 35,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    flexDirection: 'row',        // Organiza os cards em linha
    justifyContent: 'space-around', // Espaça os cards igualmente
    alignItems: 'center',
    flexWrap: 'wrap',            // Permite que os cards que não couberem em uma linha sejam quebrados para a próxima
  },
  card: {
    width: 160,
    height: 265,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,  // adiciona um espaço entre os cards
    borderRadius: 10,
    padding:12
  },
  imageCard: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 15,
    marginTop:5
  },
  tituloEDescricaoProduto: {
    color: '#000',
    fontSize: 10,
    textAlign: 'justify',
    alignSelf: 'flex-start',
  },
  categoriaProduto: {
    color: '#000',
    fontSize: 11,
    marginBottom: 15,
    fontWeight: '800',
    alignSelf: 'flex-start',
  }
});
