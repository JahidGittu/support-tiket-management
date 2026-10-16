import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth";
import * as ticketService from "../services/ticketService";

export const getTickets = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { status, priority, category, search } = req.query;

    const tickets = await ticketService.getTickets({
      userId: user.id,
      role: user.role,
      status: typeof status === "string" ? status : undefined,
      priority: typeof priority === "string" ? priority : undefined,
      category: typeof category === "string" ? category : undefined,
      search: typeof search === "string" ? search : undefined,
    });

    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const getTicket = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const user = req.user!;

    const ticket = await ticketService.getTicketById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    if (user.role === "CUSTOMER" && ticket.customerId !== user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this ticket",
      });
    }

    return res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const createTicket = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { title, description, category, priority } = req.body;

    const ticket = await ticketService.createTicket({
      title,
      description,
      category,
      priority,
      customerId: user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    const existingTicket = await ticketService.getTicketById(id);
    if (!existingTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const updated = await ticketService.updateTicketStatus(id, status);

    return res.status(200).json({
      success: true,
      message: `Ticket status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const assignAgent = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const { assignedToId } = req.body;

    const existingTicket = await ticketService.getTicketById(id);
    if (!existingTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const updated = await ticketService.assignTicket(id, assignedToId);

    return res.status(200).json({
      success: true,
      message: "Ticket assigned successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const user = req.user!;
    const { message, isInternal } = req.body;

    const existingTicket = await ticketService.getTicketById(id);
    if (!existingTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    if (user.role === "CUSTOMER" && existingTicket.customerId !== user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to comment on this ticket",
      });
    }

    const comment = await ticketService.addComment({
      ticketId: id,
      userId: user.id,
      message,
      isInternal: user.role === "CUSTOMER" ? false : isInternal,
    });

    let updatedTicket = null;
    if (user.role === "CUSTOMER" && existingTicket.status !== "CLOSED") {
      updatedTicket = await ticketService.updateTicketStatus(id, "CUSTOMER_REPLIED");
    }

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: {
        comment,
        updatedStatus: updatedTicket ? updatedTicket.status : existingTicket.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
