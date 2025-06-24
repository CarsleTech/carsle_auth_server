// lib/auth.ts
import { compare, hash } from "bcryptjs";
import { sign, verify, JwtPayload, SignOptions } from "jsonwebtoken";
import { prisma } from "./db";
import { Request, Response } from "express";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface User {
  id: string;
  // username: string;
  email: string;
  createdAt: Date;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  fullName: string;
  username: string;
  email: string;
  password: string;
  referalCode?: string;
}

export interface TokenPayload {
  userId: string;
  // username: string;
  email: string;
}

export interface DecodedToken extends JwtPayload {
  userId: string;
  username: string;
  email: string;
}

// =============================================================================
// CONFIGURATION & CONSTANTS
// =============================================================================

const JWT_SECRET: string = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRATION: number = 3600;
const BCRYPT_SALT_ROUNDS: number = parseInt(
  process.env.BCRYPT_SALT_ROUNDS || "10",
  10
);

// =============================================================================
// PASSWORD UTILITIES
// =============================================================================

export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error("Password is required");
  }
  return await hash(password, BCRYPT_SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  if (!password || !hashedPassword) {
    throw new Error("Password and hashed password are required");
  }
  return await compare(password, hashedPassword);
}

// =============================================================================
// JWT TOKEN UTILITIES
// =============================================================================

export function generateToken(payload: TokenPayload): string {
  if (!payload) {
    throw new Error("Payload is required for token generation");
  }
  const options: SignOptions = { expiresIn: JWT_EXPIRATION };
  return sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): DecodedToken {
  if (!token) {
    throw new Error("Token is required for verification");
  }
  try {
    return verify(token, JWT_SECRET) as DecodedToken;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

// =============================================================================
// AUTHENTICATION MIDDLEWARE
// =============================================================================

export function isAuthenticated(req: Request): DecodedToken {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw new Error("Authentication token is required");
  }

  return verifyToken(token);
}

export async function getCurrentUser(req: Request): Promise<User> {
  try {
    const decoded = isAuthenticated(req);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        // username: true,
        email: true,
        createdAt: true,
        // Don't select password for security
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error("Authentication failed");
  }
}

// =============================================================================
// USER AUTHENTICATION FUNCTIONS
// =============================================================================

export async function loginUser(req: Request): Promise<string> {
  const body: LoginCredentials = req.body;
  const { email, password } = body;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Check if user exists
  if (!user) {
    throw new Error("User not found");
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  // Generate and return JWT token
  return generateToken({
    userId: user.id,
    // username: user.username,
    email: user.email,
  });
}

export async function signUpUser(req: Request): Promise<string> {
  const body: SignUpCredentials = req.body;
  const { fullName, username, password, email, referalCode } = body;

  if (!password || !email) {
    throw new Error("Email and password are required");
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create new user
  const user = await prisma.user.create({
    data: { fullName, username, password:hashedPassword, email },
  });

  // Generate and return JWT token for the new user
  return generateToken({
    userId: user.id,
    email: user.email,
  });
}
