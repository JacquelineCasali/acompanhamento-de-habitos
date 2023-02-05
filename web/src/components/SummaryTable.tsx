import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay";
import { useEffect } from "react";
import { useState } from "react";
import dayjs from "dayjs";
const weekDay = ["D", "S", "T", "Q", " Q", "S", "S"];
const SummaryDates = generateDatesFromYearBeginning();
const minimumSummaryDatesSize = 18 * 7; // 18 semanas de quadrados
const amauntOfDaysTaFill = minimumSummaryDatesSize - SummaryDates.length;

type Summary = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>;

export function SummaryTable() {
  // fazer a chamada da API uma unica vez
  const [summary, setsummary] = useState<Summary>([]);

  useEffect(() => {
    api.get("summary").then((response) => {
      setsummary(response.data);
    });
  }, []);

  return (
    <div className="w-full flex">
      {/* cabeçalho da tabela */}

      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDay.map((weekDay, i) => {
          return (
            <div
              key={`${weekDay}-${i}`}
              className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
            >
              {weekDay}
            </div>
          );
        })}
      </div>
      {/* /* tabela  */}
      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {SummaryDates.map((date) => {
          const dayInSummary = summary.find((day) => {
            return dayjs(date).isSame(day.date, "day");
          });

          return (
            <HabitDay
              key={date.toString()}
              date={date}
              amount={dayInSummary?.amount}
              completed={dayInSummary?.completed}
            />
          );
        })}

        {amauntOfDaysTaFill > 0 &&
          Array.from({ length: amauntOfDaysTaFill }).map((_, i) => {
            return (
              <div
                key={i}
                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
              ></div>
            );
          })}
      </div>
    </div>
  );
}
