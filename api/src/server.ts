import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { listTicketsQuerySchema } from "./schemas/ticket.schemas.js";
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

app.get("/tickets", async (req, res) => {
  try {
    const validation = listTicketsQuerySchema.safeParse(req.query);

    if (!validation.success) {
      res.status(400).json({
        error: "Parâmetros inválidos.",
        details: validation.error.issues,
      });
      return;
    }

    const { email } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, role: true },
    });

    if (!user || user.role !== "EMPLOYEE") {
      res.status(404).json({
        error: "Funcionário não encontrado.",
      });
      return;
    }

    const tickets = await prisma.ticket.findMany({
      where: { affectedUserId: user.id },
      select: {
        number: true,
        title: true,
        type: true,
        category: true,
        priority: true,
        status: true,
        dueAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      employee: user.name,
      total: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("Erro ao consultar chamados:", error);
    res.status(500).json({
      error: "Não foi possível consultar os chamados.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Nexo Assist API rodando em http://localhost:${PORT}`);
});
