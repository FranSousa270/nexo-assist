
import { Router } from "express";
import { getTickets, postTicket } from "../controllers/ticket.controllers.js";

const ticketRoutes = Router();

ticketRoutes.get("/", getTickets);
ticketRoutes.post("/", postTicket);

export default ticketRoutes;
