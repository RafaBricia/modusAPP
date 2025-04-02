import { useState } from 'react';
import { Image, Text, StyleSheet, View, Alert, TouchableOpacity } from 'react-native';

export default function Card() {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <View style={styles.card}>
        
    </View>
  );
}

const styles = StyleSheet.create({
  
    card: {

    }

});
