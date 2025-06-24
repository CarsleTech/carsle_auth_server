// lib/user.ts
import { getCurrentUser, signUpUser, User } from "./auth";
import { prisma } from './db';

import { Request } from 'express';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface ApiResponse<T extends object> {
  success: boolean;
  error?: string;
  message?: string;
  user?: T;
  token?: string;
}

export interface UpdateUserData {
  // username?: string;
  email?: string;
}

export interface UserResponse {
  id: string;
  // username: string;
  email: string;
  createdAt: Date;
}

// =============================================================================
// USER MANAGEMENT FUNCTIONS
// =============================================================================

export async function getUser(req: Request): Promise<ApiResponse<UserResponse>> {
  try {
    const user = await getCurrentUser(req);
    return {
      success: true,
      user: {
        id: user.id,
        // username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || "Authentication failed",
    };
  }
}

export async function createUser(req: Request): Promise<ApiResponse<object>> {
  try {
    const token = await signUpUser(req);
    return {
      success: true,
      message: "User created successfully",
      token
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || "User creation failed",
    };
  }
}

export async function updateUser(req: Request): Promise<ApiResponse<UserResponse>> {
  try {
    const user = await getCurrentUser(req);
    const body: UpdateUserData = await req.body;
    const { email } = body;

    // Validate that at least one field is provided
    if ( !email) {
      return {
        success: false,
        error: "At least one field (username or email) must be provided for update",
      };
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(email && { email }),
      },
      select: {
        id: true,
        // username: true,
        email: true,
        createdAt: true,
      }
    });

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || "Update failed",
    };
  }
}

export async function deleteUser(req: Request): Promise<ApiResponse<object>> {
  try {
    const user = await getCurrentUser(req);
    
    // Delete user from database
    await prisma.user.delete({
      where: { id: user.id }
    });
    
    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || "Deletion failed",
    };
  }
}