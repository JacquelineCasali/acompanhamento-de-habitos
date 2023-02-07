import "./src/lib/dayjs";
import { StatusBar } from "react-native";
// importando as fontes
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import * as Notifications from "expo-notifications";

import { Routes } from "./src/routes";

import { Loading } from "./src/components/Loading";
import { useEffect } from "react";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  async function schedulePushNotification() {
    const schedule = await Notifications.getAllScheduledNotificationsAsync();
    console.log("Agendadas: ", schedule);

    if (schedule.length > 0) {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }

    const trigger = new Date(Date.now());
    trigger.setHours(trigger.getHours() + 5);
    trigger.setSeconds(0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Olá ! 😀",
        body: "Você praticou seus hábitos hoje?",
      },
      trigger,
    });
  }

  useEffect(() => {
    schedulePushNotification();
  }, []);

  // tira a esclamação para testar o Loading quando a fonte não for carregada
  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <>
      <Routes />
      {/* parte de cima do celular onde fica a porcentagem de bateria */}
      <StatusBar
        barStyle={"light-content"}
        backgroundColor="transparent"
        translucent
      />
    </>
  );
}
