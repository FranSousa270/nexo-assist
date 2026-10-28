
import * as z from "zod";

export const updateTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "O título deve ter pelo menos 5 caracteres.")
    .max(120)
    .optional(),

  description: z
    .string()
    .trim()
    .min(10, "A descrição deve ter pelo menos 10 caracteres.")
    .max(2000)
    .optional(),

  priority: z
    .enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"])
    .optional(),

  status: z
    .enum(["OPEN", "IN_PROGRESS", "WAITING", "RESOLVED", "CLOSED"])
    .optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  "Informe pelo menos um campo para atualizar.",
);
