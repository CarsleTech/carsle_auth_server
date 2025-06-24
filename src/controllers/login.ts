import { loginUser } from "../lib/auth";
import { Request, Response } from 'express';

type loginHandler = {
    handlePost(req: Request, res: Response): Promise<void>;
}

class AuthHandler implements loginHandler {
   handlePost = async (req: Request, res: Response): Promise<void> => {
        try {
            // Input validation
            const validationError = this.validateLoginInput(req);
            if (validationError) {
                res.status(400).json({
                    success: false,
                    error: validationError
                });
                return;
            }

            const token = await loginUser(req);
            
            res.status(200).json({
                success: true,
                message: "Login successful",
                token 
            });
        } catch (error: any) {
            console.error('POST /api/auth/login error:', error);
            
            // Determine appropriate status code and error message
            let statusCode = 400;
            let errorMessage = error.message || "An error occurred during login";
            
            // Handle authentication-specific errors
            if (this.isAuthenticationError(error.message)) {
                statusCode = 401;
                errorMessage = "Invalid email or password";
            }
            // Handle validation errors
            else if (this.isValidationError(error.message)) {
                statusCode = 400;
                errorMessage = error.message;
            }
            // Handle rate limiting or server errors
            else if (this.isServerError(error.message)) {
                statusCode = 500;
                errorMessage = "Internal server error";
            }
            
            // Send only one response
            res.status(statusCode).json({
                success: false,
                error: errorMessage 
            });
        }
    }

    private validateLoginInput(req: Request): string | null {
        const { username, password } = req.body;

        // Check if request body exists
        if (!req.body || typeof req.body !== 'object') {
            return "Request body is required";
        }

        // Check for missing fields
        if (!req.body.hasOwnProperty('username')) {
            return "Username is required";
        }

        if (!req.body.hasOwnProperty('password')) {
            return "Password is required";
        }

        // Check for null/undefined values
        if (username === null || username === undefined) {
            return "Username cannot be null or undefined";
        }

        if (password === null || password === undefined) {
            return "Password cannot be null or undefined";
        }

        // Check for empty strings
        if (typeof username === 'string' && username.trim() === '') {
            return "Username cannot be empty";
        }

        if (typeof password === 'string' && password.trim() === '') {
            return "Password cannot be empty";
        }

        // Check data types
        if (typeof username !== 'string') {
            return "Username must be a string";
        }

        if (typeof password !== 'string') {
            return "Password must be a string";
        }

        // Check length constraints
        if (username.length > 100) {
            return "Username is too long (maximum 100 characters)";
        }

        if (password.length > 100) {
            return "Password is too long (maximum 100 characters)";
        }

        // Additional security checks
        if (username.length < 3) {
            return "Username must be at least 3 characters long";
        }

        if (password.length < 6) {
            return "Password must be at least 6 characters long";
        }

        return null; // No validation errors
    }

    private isAuthenticationError(errorMessage: string): boolean {
        if (!errorMessage) return false;
        
        const authErrors = [
            "User not found",
            "Invalid credentials",
            "Invalid password",
            "Account not found",
            "Authentication failed",
            "Wrong password",
            "User does not exist",
            "Email and password are required" // Added this based on your error
        ];
        
        return authErrors.some(error => 
            errorMessage.toLowerCase().includes(error.toLowerCase())
        );
    }

    private isValidationError(errorMessage: string): boolean {
        if (!errorMessage) return false;
        
        const validationErrors = [
            "required",
            "invalid format",
            "too long",
            "too short",
            "cannot be empty",
            "must be a string",
            "cannot be null"
        ];
        
        return validationErrors.some(error => 
            errorMessage.toLowerCase().includes(error.toLowerCase())
        );
    }

    private isServerError(errorMessage: string): boolean {
        if (!errorMessage) return false;
        
        const serverErrors = [
            "database error",
            "connection failed",
            "timeout",
            "internal error",
            "server error"
        ];
        
        return serverErrors.some(error => 
            errorMessage.toLowerCase().includes(error.toLowerCase())
        );
    }
}

const authHandler = new AuthHandler();
export default authHandler;