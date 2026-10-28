
import { Router } from "express";
import { getTickets, postTicket, patchTicket } from "../controllers/ticket.controllers.js";

const ticketRoutes = Router();

ticketRoutes.get("/", getTickets);
ticketRoutes.post("/", postTicket);
ticketRoutes.patch("/:number", patchTicket);

export default ticketRoutes;
