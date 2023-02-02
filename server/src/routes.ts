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
            }}),
        } }})});

  //  rota do dia 
  app.get("/day", async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
    });
    const { date } = getDayParams.parse(request.query);
    const parseDate = dayjs(date).startOf("day");

    const weekDay = parseDate.get("day");
  
    //mostra todos os habitos possiveis

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        weekDays: {
          some: {
            week_day: weekDay,
          }, },
      } });
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

// completar e não completar um habito

// // patch atualiza  alguma recurso especifico
app.patch('/habits/:id/toggle',async (request)=>{
// // route param => parametro de identificação 
const toggleHabitParams=z.object({
  id:z.string().uuid(),
})
const {id} = toggleHabitParams.parse(request.params)
// completando no dia atual 
const today=dayjs().startOf('day').toDate()
let day=await prisma.day.findUnique({
  where:{
    date:today
  }
})
// // cria a informação no banco de dados 
if(!day){
  day=await prisma.day.create({
    data:{
    date:today,
    }})}

    const dayHabit = await prisma.dayHabit.findUnique({
        where:{
          day_id_habit_id:{
            day_id:day.id,
            habit_id:id,
          }
        }
      })

if(dayHabit){
await prisma.dayHabit.delete({
  where:{
    id:dayHabit.id
  }
})
}else{
// completar o habito nesse dia 
await prisma.dayHabit.create ({
  data:{
    day_id:day.id,
    habit_id:id,
  }
})
}
})
// resumo do dia 
app.get('/summary', async()=>{
// [{date: 17/01, amount (habitos possivel de completar na data ):5 completed:1},{},{}]
const summary= await prisma.$queryRaw `
SELECT 
D.id, 
D.date,
(
  SELECT 
    cast(count(*) as float)
    FROM day_habits DH
WHERE DH.day_id = D.id
) as completed,
(
  SELECT 
  cast(count(*) as float)
  FROM habit_week_days HWD
  JOIN habits H
  ON H.id = HWD.habit_id 
WHERE 
HWD.week_day= cast(strftime('%w',D.date/1000.0,'unixepoch') as int)
 AND H.created_at <= D.date
) as amout

FROM days D

`
return summary

})

}