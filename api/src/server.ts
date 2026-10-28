import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import ticketRoutes from "./routes/ticket.routes.js";

const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "nexo-assist-api",
  });
});

app.get("/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Erro ao consultar o banco:", error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.use("/tickets", ticketRoutes);

app.listen(PORT, () => {
  console.log(`Nexo Assist API rodando em http://localhost:${PORT}`);
});
