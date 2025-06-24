// lib/user.ts
import { getCurrentUser, signUpUser, User } from "./auth";
import { prisma } from './db';
import { Request } from 'express';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface ApiResponse<T extends object = {}> {
  success: boolean;
  error?: string;
  message?: string;
  user?: T;
  token?: string;
  otp?: string;
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

export interface GenerateOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
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

export async function createUser(req: Request): Promise<ApiResponse> {
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
    const body: UpdateUserData = req.body;
    const {  email } = body;

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
        // ...(username && { username }),
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

export async function deleteUser(req: Request): Promise<ApiResponse> {
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

// =============================================================================
// OTP FUNCTIONS
// =============================================================================

export async function generateOtp(req: Request): Promise<ApiResponse> {
  try {
    const body: GenerateOtpRequest = req.body;
    const { email } = body;
    
    if (!email) {
      return {
        success: false,
        error: "Email is required",
      };
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Here you would typically save the OTP to your database associated with the email
    // For demonstration, we will just return the OTP
    return {
      success: true,
      otp,
      message: "OTP generated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || "Failed to generate OTP",
    };
  }
}

export async function verifyOtp(req: Request): Promise<ApiResponse> {
  try {
    const body: VerifyOtpRequest = req.body;
    const { email, otp } = body;
    
    if (!email || !otp) {
      return {
        success: false,
        error: "Email and OTP are required",
      };
    }

    // Here you would typically verify the OTP from your database
    // For demonstration, we will just check if the OTP is a 6-digit number
    if (/^\d{6}$/.test(otp)) {
      return {
        success: true,
        message: "OTP verified successfully",
      };
    } else {
      return {
        success: false,
        error: "Invalid OTP format",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || "Failed to verify OTP",
    };
  }
}