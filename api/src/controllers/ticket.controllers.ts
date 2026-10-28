
import type { Request, Response } from "express";
import { listTicketsQuerySchema } from "../schemas/ticket.schemas.js";
import { createTicketSchema } from "../schemas/create-ticket.schema.js";
import {
  createTicket,
  listEmployeeTickets,
} from "../services/ticket.services.js";

export async function getTickets(req: Request, res: Response) {
  const validation = listTicketsQuerySchema.safeParse(req.query);

  if (!validation.success) {
    res.status(400).json({
      error: "Parâmetros inválidos.",
      details: validation.error.issues,
    });
    return;
  }

  try {
    const result = await listEmployeeTickets(validation.data.email);

    if (!result) {
      res.status(404).json({
        error: "Funcionário não encontrado.",
      });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao consultar chamados:", error);

    res.status(500).json({
      error: "Não foi possível consultar os chamados.",
    });
  }
}

export async function postTicket(req: Request, res: Response) {
  const validation = createTicketSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      error: "Dados do chamado inválidos.",
      details: validation.error.issues,
    });
    return;
  }

  try {
    const ticket = await createTicket(validation.data);

    if (!ticket) {
      res.status(404).json({
        error: "Funcionário não encontrado.",
      });
      return;
    }

    res.status(201).json({
      message: "Chamado criado com sucesso.",
      ticket,
    });
  } catch (error) {
    console.error("Erro ao criar chamado:", error);

    res.status(500).json({
      error: "Não foi possível criar o chamado.",
    });
  }
}
