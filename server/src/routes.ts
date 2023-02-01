import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma";

// // Método HTTP: get, Post , Put, Patch,Delete
// // get busca informação  (traz lista)
// // post cria alguma coisa,
// // put atualiza  alguma recurso por completo
// // patch atualiza  alguma recurso especifico
// // delete deleta algum recurso

// // rota de criação do novo habito
export async function appRoutes(app: FastifyInstance) {
  app.post("/habits", async (request) => {
    // validação
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6)),
    });
    // title e dia da semana
    const { title, weekDays } = createHabitBody.parse(request.body);

    // com biblioteca de datas
    const today = dayjs().startOf("day").toDate();

    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map((weekDay) => {
            return {
              week_day: weekDay,
            };
          }),
        },
      },
    });
  });

  app.get("/day", async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
    });
    const { date } = getDayParams.parse(request.query);
    const parseDate = dayjs(date).startOf("day");

    const weekDay = parseDate.get("day");

    console.log(date, weekDay);
    //mostra todos os habitos possiveis

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        weekDays: {
          some: {
            week_day: weekDay,
          },
        },
      },
    });
    //mostra os habitos que já forma completados

    const day = await prisma.day.findUnique({
      where: {
        date: parseDate.toDate(),
      },
      include: {
        dayHabit: true,
      },
    });
    const completedHabits = day?.dayHabit.map((dayHabit) => {
      return dayHabit.habit_id;
    });
    return { possibleHabits, completedHabits };
  });
}
