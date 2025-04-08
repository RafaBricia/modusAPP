import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Divider, Menu } from "react-native-paper";
const HomeHeader = () => {

    const router = useRouter();
    const [show, setShow] = useState<boolean>(false);

    return (
        <Menu 
        visible={show}
        onDismiss={() => setShow(false)}
        anchor={
            <TouchableOpacity onPress={() => setShow(true)} style={{ marginEnd: 20 }}>
                <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
            </TouchableOpacity>
        }
        >

            <Menu.Item title='Perfil'></Menu.Item>
            <Menu.Item title='Configurações'></Menu.Item>
            <Menu.Item title="Conversar com a IA" onPress={() => router.replace("/changeName")} />
            <Divider style={{borderColor: 'white'}}/>
            <Menu.Item title='Sair' onPress={() => { router.replace("/login") }}></Menu.Item>

        </Menu>

    );
}

export default HomeHeader;