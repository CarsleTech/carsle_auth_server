import { Request, Response } from "express";

const healthCheck = async (req: Request, res: Response) => {
  try {
    res.json({server: "carsle-auth", status: "OK"});
  } catch (error) {
    res.status(500).json({ status: "ERROR", message: "Health check failed" });
  }
};

export { healthCheck };
