"@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import httpService from "./services/httpService";
import config from '../config';  // Mudei para import direto

const url = `http://${config.SERVER}:${config.PORT}/api`;

const register = () => {
  const router = useRouter();


  const [email, setEmail] = useState({ value: "", dirty: false });
  const [fullName, setFullName] = useState({ value: "", dirty: false });
  const [cpf, setCpf] = useState({ value: "", dirty: false });
  const [password, setPassword] = useState({ value: "", dirty: false });
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    dirty: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cpfRegex = /^\d{11}$/;

  const handleErrorEmail = () => {
    if (!email.value && email.dirty) {
      return <Text style={styles.error}>Campo obrigatório</Text>;
    } else if (!emailRegex.test(email.value) && email.dirty) {
      return <Text style={styles.error}>E-mail inválido</Text>;
    }
    return <Text style={styles.error}></Text>;
  };

  const handleErrorFullName = () => {
    if (!fullName.value && fullName.dirty) {
      return <Text style={styles.error}>Campo obrigatório</Text>;
    } else if (fullName.value.length < 2 && fullName.dirty) {
      return (
        <Text style={styles.error}>Nome deve ter pelo menos 2 caracteres</Text>
      );
    }
    return <Text style={styles.error}></Text>;
  };

  const handleErrorCpf = () => {
    if (!cpf.value && cpf.dirty) {
      return <Text style={styles.error}>Campo obrigatório</Text>;
    } else if (!cpfRegex.test(cpf.value) && cpf.dirty) {
      return (
        <Text style={styles.error}>
          CPF inválido. Deve conter 11 dígitos numéricos
        </Text>
      );
    }
    return <Text style={styles.error}></Text>;
  };

  const handleErrorPassword = () => {
    if (!password.value && password.dirty) {
      return <Text style={styles.error}>Campo obrigatório</Text>;
    }
    return <Text style={styles.error}></Text>;
  };

  const handleErrorConfirmPassword = () => {
    if (!confirmPassword.value && confirmPassword.dirty) {
      return <Text style={styles.error}>Campo obrigatório</Text>;
    } else if (
      password.value !== confirmPassword.value &&
      confirmPassword.dirty
    ) {
      return <Text style={styles.error}>As senhas não coincidem</Text>;
    }
    return <Text style={styles.error}></Text>;
  };

  const validateForm = () => {
    setEmail({ ...email, dirty: true });
    setFullName({ ...fullName, dirty: true });
    setCpf({ ...cpf, dirty: true });
    setPassword({ ...password, dirty: true });
    setConfirmPassword({ ...confirmPassword, dirty: true });

    return (
      email.value &&
      emailRegex.test(email.value) &&
      fullName.value &&
      fullName.value.length >= 2 &&
      cpf.value &&
      cpfRegex.test(cpf.value) &&
      password.value &&
      confirmPassword.value &&
      password.value === confirmPassword.value
    );
  };

  const sendForm = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
        const userData = {
            email: email.value,
            nome: fullName.value,  
            cpf: cpf.value,
            senha: password.value  
        };

        console.log('Dados sendo enviados:', userData);
        Alert.alert(
          'Configuração',
          `Servidor: ${config.SERVER}\nPorta: ${config.PORT}\nURL: ${url}`
        );

        const response = await httpService.post(`${url}/cliente`, userData);

        console.log('Resposta:', response);
        router.replace('/(tabs)/home');
    } catch (error) {
        console.error('Erro completo:', error);
        router.replace('/login');

        
    } finally {
        setIsLoading(false);
    }
};

//   const sendForm = async () => {
//     if (!validateForm()) return;

//     setIsLoading(true);

//     try {
//         const userData = {
//             email: email.value,
//             nome: fullName.value,  
//             cpf: cpf.value,
//             senha: password.value  
//         };

//         console.log('Dados sendo enviados:', userData);
//         Alert.alert(
//           'Configuração do Servidor',
//           `Server: ${config.SERVER}\nPort: ${config.PORT}\nURL Final: http://${config.SERVER}:${config.PORT}`
//         );
//                 console.log('Server:', config.SERVER);
//         console.log('Port:', config.PORT);
//         console.log('URL Final:', `http://${config.server}:${config.port}`);

//         const response = await httpService.post(
//             `${url}/api/cliente`,
//             userData
//         );

//         console.log('Resposta:', response);
//         router.replace('/(tabs)/home');
//     } catch (error) {
//         console.error('Erro completo:', error);
//         router.replace('/login');

        
//     } finally {
//         setIsLoading(false);
//     }
// };

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

      <Text style={styles.label}>Nome Completo:</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        value={fullName.value}
        onChangeText={(text) => setFullName({ value: text, dirty: true })}
      />
      {handleErrorFullName()}

      <Text style={styles.label}>CPF:</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        value={cpf.value}
        keyboardType="numeric"
        maxLength={11}
        onChangeText={(text) => {
          const numericText = text.replace(/\D/g, "");
          setCpf({ value: numericText, dirty: true });
        }}
      />
      {handleErrorCpf()}

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#999"
        secureTextEntry
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, dirty: true })}
      />
      {handleErrorPassword()}

      <Text style={styles.label}>Repetir Senha:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#999"
        value={confirmPassword.value}
        onChangeText={(text) =>
          setConfirmPassword({ value: text, dirty: true })
        }
      />
      {handleErrorConfirmPassword()}

      <Text style={styles.loginLink}>
        Já possui cadastro?{" "}
        <Text
          style={styles.loginLinkBold}
          onPress={() => router.replace("/welcome")}
        >
          Faça login
        </Text>
      </Text>

      <TouchableOpacity 
        onPress={sendForm} 
        style={styles.loginButton}
        disabled={isLoading}
      >
        <Text style={{ color: "#FFF" }}>
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </Text>
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
    margin: "10%",
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
    marginBottom: 0,
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

export default register;
