import { api } from "../lib/axios";
import { Check } from "phosphor-react";
import { FormEvent } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { useState } from "react";

const availableWeekDays = [
  "Domingo",
  "Segunda-Feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
  "Sábado",
];

// nao fazer o redirecionamento do usuario
export function NewHabitForm() {
  const [title, setTitle] = useState("");

  //  valor do checkbox
  const [weekDays, setWeekDays] = useState<number[]>([]);

  async function createNewHabit(event: FormEvent) {
    event.preventDefault();

    if (!title || weekDays.length === 0) {
      return;
    }
    await api.post("habits", {
      title,
      weekDays,
    });

    setTitle("");
    setWeekDays([]);
    alert("Habito criado com sucesso");
  }
  function handleToggleWeekDay(weekDay: number) {
    if (weekDays.includes(weekDay)) {
      // const weekDaysIndex = weekDays.findIndex((day) => day === weekDay);
      const weeDaysWithRemovedOne = weekDays.filter((day) => day !== weekDay);
      setWeekDays(weeDaysWithRemovedOne);
    } else {
      const weekDaysWithAddedOne = [...weekDays, weekDay];
      setWeekDays(weekDaysWithAddedOne);
    }
  }

  // modal de criação de habitos
  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual o seu comprometimento
      </label>
      <input
        type="text"
        id="title"
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
        placeholder="ex: Exercicios , dormir, etc"
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrência?
      </label>

      <div className="flex flex-col gap-2 mt-3">
        {availableWeekDays.map((weekDay, index) => {
          return (
            <Checkbox.Root
              key={weekDay}
              className="flex items-center gap-3 group"
              checked={weekDays.includes(index)}
              onCheckedChange={() => {
                handleToggleWeekDay(index);
              }}
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg=zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500  group-data-[state=checked]:border-green-500">
                <Checkbox.Indicator>
                  {/* incone do check */}
                  <Check size={20} className="text-white" />
                </Checkbox.Indicator>
              </div>

              <span className="text-white leading-tight">{weekDay}</span>
            </Checkbox.Root>
          );
        })}
      </div>

      <button
        type="submit"
        className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 "
      >
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  );
}