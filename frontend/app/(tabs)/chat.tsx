import { Fragment, useEffect, useRef, useState } from "react";
import { SafeAreaView, Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import Animated from "react-native-reanimated";

import config from '../../config';  

const server = `${config.SERVER}`;
const port = `${config.PORT}`

let ws: WebSocket

const Chat = () => {
    
    const router = useLocalSearchParams();
    const scrollRef = useRef<FlatList>(null)
    
    const [userLogged, setUserLogged] = useState('');
    const [chat, setChat] = useState<{ messages: any[] }>({ messages: [] });
    const [text, setText] = useState("");
    // const [name, setName] = useState('');

// o asycnStorage retorna uma Promise, então precisa usar um useEffect com await ou .then().
   useEffect(() => {
    const fetchUserName = async () => {
        try {
            const storedName = await AsyncStorage.getItem('userName');
            if (storedName) {
                setUserLogged(storedName);
            }
        } catch (error) {
            console.error('Erro ao recuperar nome do usuário:', error);
        }
    };

    fetchUserName();
}, []);

    
    useEffect(() => {
        ws = new WebSocket(`ws://${server}:${port}`);
        ws.onopen = () =>{
            console.log('WebSocket conectado')
        }
        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            setChat((prevChat) => ({ messages: [...prevChat.messages, msg] }));
            if(msg.sendBy === userLogged){
                setText("");

            }
            scrollRef.current?.scrollToEnd({animated:true})
        };
    },[])

    const sendMensagem = () => {
        if (text.trim() !== "") {
            const newMessage = { text, sentBy: userLogged };
            ws.send(JSON.stringify(newMessage));
            setChat((prevChat) => ({ messages: [...prevChat.messages, newMessage] }));
            setText("");
        }
    };

    return (
        <Fragment>
            <FlatList
                ref={scrollRef}
                style={styles.scrollViewContainer}
                data={chat.messages}
                renderItem={({ item }) => <Balloon message={item} userLogged={userLogged} />}
                ListEmptyComponent={() => <Text style={styles.emptyMessage}>Nenhuma mensagem</Text>}
            />

            <SafeAreaView>
                <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                style={styles.inputContainer}>
                    <TextInput
                        onChangeText={setText}
                        style={styles.messageChat}
                        value={text}
                        placeholderTextColor="black"
                        placeholder="Escreva uma mensagem"
                    />
                    <TouchableOpacity disabled={(text.trim()==='')}onPress={sendMensagem} style={styles.sendButton}>
                        <Ionicons name="send" size={24} color="white" />
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Fragment>
    );
};

const Balloon = ({ message, userLogged }: any) => {
    const sent = userLogged === message.sentBy;
    const balloonColor = sent ? styles.balloonSent : styles.balloonReceived;
    const balloonTextColor = sent ? styles.balloonTextSent : styles.balloonTextReceived;
    const bubbleWrapper = sent ? styles.bubbleWrapperSent : styles.bubbleWrapperReceived;

    return (
        <View style={{ marginBottom: "2%" }}>
            <View style={{ ...styles.bubbleWrapper, ...bubbleWrapper }}>
                <View style={{ ...styles.balloon, ...balloonColor }}>
                    <Text>{message.sentBy}</Text>
                    <Text style={{ ...styles.balloonText, ...balloonTextColor }}>{message.text}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1,
        padding: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#F0F0F0",
        borderTopWidth: 1,
        borderColor: "#D3D3D3",
    },
    messageChat: {
        flex: 1,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#D3D3D3",
        fontSize: 16,
        marginTop:25
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 50,
    },
    emptyMessage: {
        alignSelf: "center",
        color: "#848484",
    },
    bubbleWrapper: {
        flexDirection: "column",
    },
    bubbleWrapperSent: {
        alignSelf: "flex-end",
        marginLeft: 40,
    },
    bubbleWrapperReceived: {
        alignSelf: "flex-start",
        marginRight: 40,
    },
    balloon: {
        padding: 8,
        borderRadius: 16,
    },
    balloonSent: {
        backgroundColor: "#007AFF",
    },
    balloonReceived: {
        backgroundColor: "#E5E5EA",
    },
    balloonText: {
        fontSize: 16,
    },
    balloonTextSent: {
        color: "white",
    },
    balloonTextReceived: {
        color: "black",
    },
});

export default Chat;
