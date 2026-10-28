
import * as z from "zod";

export const listTicketsQuerySchema = z.object({
  email: z.email().trim().toLowerCase(),
});
