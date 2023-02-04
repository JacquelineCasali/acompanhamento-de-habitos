import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay";

const weekDay = ["D", "S", "T", "Q", " Q", "S", "S"];
const SummaryDates = generateDatesFromYearBeginning();
const minimumSummaryDatesSize= 18 * 7 // 18 semanas de quadrados
const amauntOfDaysTaFill =minimumSummaryDatesSize - SummaryDates.length
export function SummaryTable() {
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
       {SummaryDates.map(date=>{
        return( 
        <HabitDay 
        key={date.toString()}
        amount={5} 
        completed={Math.round(Math.random()*5)} 
       />)
       })}

       {amauntOfDaysTaFill > 0 && Array.from({ length: amauntOfDaysTaFill}).map((_ , i) => {
        return(
          
    <div key={i} className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"></div>
                 
        )
       })}
      </div>
    </div>
  );
}
