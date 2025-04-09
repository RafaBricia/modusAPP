import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { CarrinhoProvider } from "@/context/CarrinhoContext"; 
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
    
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CarrinhoProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="welcome" options={{ headerShown: false }}/>
            <Stack.Screen name="login" options={{ headerShown: false }}/>
            <Stack.Screen name="register" options={{ headerShown: false }}/>
            <Stack.Screen 
              name="chat" 
              options={{
                title: "Artificial Intelligence Chat",
                headerTitleAlign: 'center',
                headerLeft: () => (
                  <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name='arrow-back' size={24} color="black"/>
                  </TouchableOpacity>
                )
              }}
            />
            <Stack.Screen 
              name="changeName" 
              options={{ 
                title: "Escreva seu nome",
                headerLeft: () => (
                  <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name='arrow-back' size={24} color="black"/>
                  </TouchableOpacity>
                )
              }} 
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </CarrinhoProvider>
    </GestureHandlerRootView>
  );
}
