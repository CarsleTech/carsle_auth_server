import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/auth";

export const authenticateToken = (req:any, res:Response, next:NextFunction)=>{
  try {
       // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required' 
    });
  }

  // Verify token
 req.user = verifyToken(token)
    
    next(); 
  } catch (error) {
    res.status(401).json({
      error: 'Invalid or expired token',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }

}