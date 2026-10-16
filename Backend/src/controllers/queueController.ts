import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth";
import * as queueService from "../services/queueService";

export const getWaitingQueue = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const queue = await queueService.getWaitingQueue();
    return res.status(200).json({
      success: true,
      data: queue,
      count: queue.length,
    });
  } catch (error) {
    next(error);
  }
};

export const assignNextFromQueue = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await queueService.assignFromQueue();
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    next(error);
  }
};

export const getStaffLoadSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const summary = await queueService.getStaffLoadSummary();
    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

export const getActivityLogs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const logs = await queueService.getActivityLogs(10);
    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleStaffAvailability = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;
    const staff = await queueService.toggleStaffAvailability(id, status);
    return res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

export const assignTicketWithValidation = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    const { staffId, forceOverride } = req.body;
    const result = await queueService.assignTicketWithValidation(
      id,
      staffId || null,
      Boolean(forceOverride)
    );

    if (result.conflict) {
      return res.status(409).json({
        success: false,
        conflict: true,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.ticket,
    });
  } catch (error) {
    next(error);
  }
};
