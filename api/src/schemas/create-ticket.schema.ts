
import * as z from "zod";

export const createTicketSchema = z.object({
  title: z.string().trim().min(5, "O título deve ter pelo menos 5 caracteres.").max(120),
  description: z.string().trim().min(10, "A descrição deve ter pelo menos 10 caracteres.").max(2000),
  type: z.enum(["INCIDENT", "REQUEST"]),
  category: z.enum([
    "ACCESS",
    "NETWORK_VPN",
    "HARDWARE",
    "SOFTWARE",
    "EMAIL",
    "OTHER",
  ]),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  affectedUserEmail: z.email().trim().toLowerCase(),
});
