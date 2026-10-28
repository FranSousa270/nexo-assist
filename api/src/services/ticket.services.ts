
import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma.js";
import type { createTicketSchema } from "../schemas/create-ticket.schema.js";
import type { z } from "zod";
import { calculateSlaDeadline } from "./sla.services.js";

type CreateTicketInput = z.infer<typeof createTicketSchema>;

export async function listEmployeeTickets(email: string) {
  const employee = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, role: true },
  });

  if (!employee || employee.role !== "EMPLOYEE") {
    return null;
  }

  const tickets = await prisma.ticket.findMany({
    where: { affectedUserId: employee.id },
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

  return {
    employee: employee.name,
    total: tickets.length,
    tickets,
  };
}

export async function createTicket(input: CreateTicketInput) {
  const { affectedUserEmail, ...ticketData } = input;

  const employee = await prisma.user.findUnique({
    where: { email: affectedUserEmail },
    select: { id: true, role: true },
  });

  if (!employee || employee.role !== "EMPLOYEE") {
    return null;
  }

  const prefix = ticketData.type === "INCIDENT" ? "INC" : "REQ";
  const number = `${prefix}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const dueAt = calculateSlaDeadline(ticketData.priority);

  return prisma.ticket.create({
    data: {
      ...ticketData,
      number,
      dueAt,
      affectedUserId: employee.id,
      createdById: employee.id,
    },
    select: {
      number: true,
      dueAt: true,
      title: true,
      description: true,
      type: true,
      category: true,
      priority: true,
      status: true,
      createdAt: true,
    },
  });
}
