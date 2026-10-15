import { Request, Response, NextFunction } from "express";
import { analyzeTicketWithAi } from "../services/geminiService";

export const classifyTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;

    const result = await analyzeTicketWithAi(title, description);

    return res.status(200).json({
      success: true,
      message: "AI analysis completed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
