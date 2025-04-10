import { useRouter } from "expo-router";
import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Image, 
  Alert 
} from "react-native";
import httpService from "./services/httpService";
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';


// ADICIONAR TRATATIVAS DE ERROS 

const server = `${config.SERVER}`;
const port = `${config.PORT}`;

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState({ value: "", dirty: false });
  const [password, setPassword] = useState({ value: "", dirty: false });
  const [errorMessage, setErrorMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const senhaRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,10}$/; 


  const handleErrorEmail = () => {
    if (!email.value && email.dirty) {
      return <Text style={styles.error}>Campo obrigatório</Text>;
    } else if (!emailRegex.test(email.value) && email.dirty) {
      return <Text style={styles.error}>E-mail inválido</Text>;
    }
    return null;
  };

  const handleErrorPassword = () => {
    if (!password.value && password.dirty) {
      return <Text style={styles.error}>Campo obrigatório</Text>;
    } else if (!senhaRegex.test(password.value)&& password.dirty){
      return <Text style={styles.error}>Senha inválida</Text>
    }
    return null;
  };

  const handleErrorForm = () => {
    setEmail({ ...email, dirty: true });
    setPassword({ ...password, dirty: true });

    if (!email.value || !emailRegex.test(email.value) || !password.value) {
      setErrorMessage("Preencha todos os campos corretamente para continuar.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const sendForm = async () => {
    if (!handleErrorForm()) return;

    try {
      const userData = {
        email: email.value,
        senha: password.value,
      };

      const response = await httpService.post(`http://${server}:${port}/api/login`, userData);

      if (response && response.token) {
        const { token, cliente } = response;

        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("userName", cliente.nome);

        console.log("Usuário autenticado:", cliente.nome);
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Erro", response?.message || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Erro ao logar:", error);
      Alert.alert("Erro", "Falha ao conectar com o servidor");
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      </View>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu email"
        placeholderTextColor="#999"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, dirty: true })}
      />
      {handleErrorEmail()}

      <Text style={styles.label}>Senha:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, dirty: true })}
      />
      {handleErrorPassword()}

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <Text style={styles.loginLink}>
        Ainda não tem uma conta? {" "}
        <Text style={styles.loginLinkBold} onPress={() => router.replace("/register")}>
          Cadastre-se
        </Text>
      </Text>

      <TouchableOpacity onPress={sendForm} style={styles.loginButton}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/welcome")} style={styles.backButton}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: 350,
    backgroundColor: "#FFF",
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    alignSelf: "center",
    flex: 1,
    margin: "30%",
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  label: {
    alignSelf: "flex-start",
    marginTop: 2,
    marginBottom: 2,
    fontWeight: "600",
    fontSize: 16,
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  loginLink: {
    alignSelf: "flex-start",
    marginTop: 10,
    marginBottom: 20,
    fontSize: 14,
    color: "#000",
  },
  loginLinkBold: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  loginButton: {
    width: "100%",
    height: 45,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 15,
  },
  backButton: {
    width: "100%",
    height: 45,
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    fontSize: 14,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default Login;
