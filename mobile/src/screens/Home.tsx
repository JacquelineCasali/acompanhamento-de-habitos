import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generate-range-between-dates";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";

const weekDay = ["D", "S", "T", "Q", " Q", "S", "S"];
const datesFromYearStart = generateDatesFromYearBeginning();
const minimumSummaryDatesSize = 18 * 5; // 18 semanas de quadrados
const amauntOfDaysTaFill = minimumSummaryDatesSize - datesFromYearStart.length;

export function Home() {
  const [loading, setLoading] = useState(true);
  const { navigate } = useNavigation();

  async function fetchData() {
    try {
    } catch (error) {
      Alert.alert("Ops, não foi possivel carregar o sumario de hábitos");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />
      {/* criando componentes */}
      <View className="flex-row mt-6 mb-2">
        {weekDay.map((weekDay, i) => (
          <Text
            key={`${weekDay}-${i}`}
            className="text-zinc-400 text-xl font-bold  text-center mx-1"
            style={{ width: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>
      {/* quadrados */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap">
          {
            // quadrados
            datesFromYearStart.map((date) => (
              <HabitDay
                key={date.toISOString()}
                onPress={() => navigate("habit", { date: date.toISOString() })}
              />
            ))
          }
          {amauntOfDaysTaFill > 0 &&
            Array.from({ length: amauntOfDaysTaFill }).map((_, index) => (
              <View
                key={index}
                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                style={{ width: DAY_SIZE, height: DAY_SIZE }}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
