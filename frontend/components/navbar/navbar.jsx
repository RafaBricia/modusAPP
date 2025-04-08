import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const filterByCategory = (category) => {
    console.log(`Filtrando por: ${category}`);
    toggleMenu(); // Fecha o menu ao clicar
  };

  return (
    <View>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Image
            source={require("../../assets/images/menu.png")}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      </View>

      {/* Side Menu */}
      {menuVisible && (
        <>
          <TouchableOpacity 
            style={styles.overlay} 
            onPress={toggleMenu}
            activeOpacity={1}
          />
          <View style={styles.sidebar}>
            <Image
              style={styles.menuLogo}
              source={require("../../assets/images/logoEncurtada.png")}
            />
            {['Camisas', 'Saias', 'Calças', 'Sutiãs', 'Calcinhas', 'Meias', 'Cropped'].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => filterByCategory(item)}
              >
                <Text style={styles.menuItem}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  
    navbar: {
        width: "100%",
        height: 150,
        backgroundColor: "#f2f2f2",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: "32%",
        marginTop: 20,
        paddingHorizontal: 15
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
      menuButton:{
        width: 40,
        height: 40,
        right: 100
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
        height: 700,
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
      overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)", // Opacidade para escurecer o fundo
        zIndex: 99, 
        width: "100%",
        height: 700,
      }
});

export default Navbar;
