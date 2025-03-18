// import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState({ value: "", dirty: false });
  const [password, setPassword] = useState({ value: "", dirty: false });
  const [errorMessage, setErrorMessage] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleErrorEmail = () => {
    if (!email.value && email.dirty) {
      return <Text style={styles.error}>Campo obrigatório</Text>;
    } else if (!emailRegex.test(email.value) && email.dirty) {
      return <Text style={styles.error}>E-mail inválido</Text>;
    }
    return <Text style={styles.error}></Text>;
  };

  const handleErrorPassword = () => {
    if (!password.value && password.dirty) {
      return <Text style={styles.error}>Campo obrigatório</Text>;
    }
    return <Text style={styles.error}></Text>;
  };

  const handleErrorForm = () => {
    setEmail({ ...email, dirty: true });
    setPassword({ ...password, dirty: true });

    if (!email.value || !emailRegex.test(email.value) || !password.value) {
      setErrorMessage("Preencha todos os campos corretamente para continuar.");
      return;
    }

    setErrorMessage("");
    router.replace("/(tabs)/home");
  };

  return (
      <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#999"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, dirty: true })}
        />
        {handleErrorEmail()}
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor="#999"
          secureTextEntry
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, dirty: true })}
        />
        {handleErrorPassword()}

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <Text style={styles.loginLink}>
          Ainda não tem uma conta? {" "}
          <Text
            style={styles.loginLinkBold}
            onPress={() => router.replace("/register")}
          >
            Cadastre-se
          </Text>
        </Text>
        <TouchableOpacity onPress={handleErrorForm} style={styles.loginButton}>
          <Text style={{ color: "#FFF" }}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/welcome")}
          style={styles.backButton}
        >
          <Text style={{ color: "#FFF" }}>Voltar</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    alignSelf: "center",  
  },

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
