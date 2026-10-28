import type { Request, Response } from "express";
import { listTicketsQuerySchema } from "../schemas/ticket.schemas.js";
import { createTicketSchema } from "../schemas/create-ticket.schema.js";
import { updateTicketSchema } from "../schemas/update-ticket.schema.js";
import {
  createTicket,
  listEmployeeTickets,
  updateTicket,
  findDuplicateTicket,
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

  const duplicate = await findDuplicateTicket(
    validation.data.affectedUserEmail,
    validation.data.type,
    validation.data.category,
    validation.data.title,
  );

  if (duplicate) {
    res.status(409).json({
      error: "Já existe um chamado ativo com o mesmo tipo e categoria.",
      duplicate,
    });
    return;
  }

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
}

export async function patchTicket(req: Request, res: Response) {
  const number = req.params.number;

  if (typeof number !== "string" || number.trim() === "") {
    res.status(400).json({
      error: "Número do chamado não informado.",
    });
    return;
  }

  const email = req.query.email;

  if (typeof email !== "string") {
    res.status(400).json({
      error: "Informe o e-mail do funcionário.",
    });
    return;
  }

  const validation = updateTicketSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      error: "Dados para atualização inválidos.",
      details: validation.error.issues,
    });
    return;
  }

  try {
    const ticket = await updateTicket(
      number,
      email.trim().toLowerCase(),
      validation.data,
    );

    if (!ticket) {
      res.status(404).json({
        error: "Chamado ou funcionário não encontrado.",
      });
      return;
    }

    res.status(200).json({
      message: "Chamado atualizado com sucesso.",
      ticket,
    });
  } catch (error) {
    console.error("Erro ao atualizar chamado:", error);

    res.status(500).json({
      error: "Não foi possível atualizar o chamado.",
    });
  }
}
