import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma.js";
import type { createTicketSchema } from "../schemas/create-ticket.schema.js";
import type { z } from "zod";
import { calculateSlaDeadline } from "./sla.services.js";
import type { updateTicketSchema } from "../schemas/update-ticket.schema.js";

type CreateTicketInput = z.infer<typeof createTicketSchema>;
type UpdateTicketInput = z.infer<typeof updateTicketSchema>;

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
      description: true,
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

export async function updateTicket(
  number: string,
  employeeEmail: string,
  input: UpdateTicketInput,
) {
  const employee = await prisma.user.findUnique({
    where: { email: employeeEmail },
    select: { id: true, role: true },
  });

  if (!employee || employee.role !== "EMPLOYEE") {
    return null;
  }

  const ticket = await prisma.ticket.findFirst({
    where: {
      number,
      affectedUserId: employee.id,
    },
    select: {
      id: true,
      priority: true,
      status: true,
    },
  });

  if (!ticket) {
    return null;
  }

  const dueAt =
    input.priority && input.priority !== ticket.priority
      ? calculateSlaDeadline(input.priority)
      : undefined;

  return prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      ...input,
      ...(dueAt ? { dueAt } : {}),
    },
    select: {
      number: true,
      title: true,
      description: true,
      type: true,
      category: true,
      priority: true,
      status: true,
      dueAt: true,
      updatedAt: true,
    },
  });
}

export async function findDuplicateTicket(
  employeeEmail: string,
  type: "INCIDENT" | "REQUEST",
  category:
    | "ACCESS"
    | "NETWORK_VPN"
    | "HARDWARE"
    | "SOFTWARE"
    | "EMAIL"
    | "OTHER",
  title: string,
) {
  const employee = await prisma.user.findUnique({
    where: { email: employeeEmail },
    select: { id: true, role: true },
  });

  if (!employee || employee.role !== "EMPLOYEE") {
    return null;
  }

  return prisma.ticket.findFirst({
    where: {
      affectedUserId: employee.id,
      type,
      category,
      status: {
        in: ["OPEN", "IN_PROGRESS", "WAITING"],
      },
      title: {
        equals: title.trim(),
        mode: "insensitive",
      },
    },
    select: {
      number: true,
      title: true,
      description: true,
      type: true,
      category: true,
      priority: true,
      status: true,
      dueAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
