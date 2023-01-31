import fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";

const app = fastify();
const prisma = new PrismaClient();

// // Método HTTP: get, Post , Put, Patch,Delete
// // get busca informação  (traz lista)
// // post cria alguma coisa,
// // put atualiza  alguma recurso por completo
// // patch atualiza  alguma recurso especifico
// // delete deleta algum recurso

app.register(cors);

// // rota
app.get("/", async () => {
  const habits = await prisma.habit.findMany({});

  return habits;
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Http Serve running http://localhost:3333");
  });
