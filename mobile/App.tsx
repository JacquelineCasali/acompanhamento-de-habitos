import './src/lib/dayjs'
import { StatusBar } from "react-native";
import {Routes} from "./src/routes"
// importando as fontes
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

import { Loading } from "./src/components/Loading";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  // tira a esclamação para testar o Loading quando a fonte não for carregada
  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <>
      <Routes/>
      {/* parte de cima do celular onde fica a porcentagem de bateria */}
      <StatusBar
        barStyle={"light-content"}
        backgroundColor="transparent"
        translucent
      />
    </>
  );
}


