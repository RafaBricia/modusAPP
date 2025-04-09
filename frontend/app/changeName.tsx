import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View, TextInput, StyleSheet } from "react-native";

const ChangeName = () => {
    const [name, setName] = useState("");
    const router = useRouter();
// usar o AsyncStorage pra salvar quem esta logado
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Digite seu nome:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                placeholderTextColor="#A0A0A0"
                onChangeText={(text) => setName(text)}
            />
            <TouchableOpacity 
                disabled={(name.trim()==='')}
                style={styles.button} 
                onPress={() => router.replace({pathname:'/(tabs)/chat', params: {name}})}
            >
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        padding: 20,
    },
    label: {
        fontSize: 18,
        color: "#000",
        marginBottom: 10,
    },
    input: {
        width: "80%",
        height: 40,
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        fontSize: 16,
        color: "#000",
        backgroundColor: "#FFF",
        marginBottom: 20,
    },
    button: {
        width: "80%",
        height: 40,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ChangeName;
