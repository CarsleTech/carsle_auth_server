import { createUser, deleteUser, getUser, updateUser } from "../lib/user";
import { Request, Response } from 'express';

type signUpHandler = {
    handleGet(req: Request, res: Response): Promise<void>;
    handlePost(req: Request, res: Response): Promise<void>;
}

class SignUpHandler implements signUpHandler {

    handleGet = async (req: Request, res: Response): Promise<void> => {
        res.status(200).json({
            success: true,
            message: "SignUp endpoint is available"
        });
    }

    handlePost = async (req: Request, res: Response): Promise<void> => {
        try {
            // Input validation
            const validationError = this.validateSignUpInput(req);
            if (validationError) {
                res.status(400).json({
                    success: false,
                    error: validationError
                });
                return;
            }

            const result = await createUser(req);
            
            // Ensure consistent response format
            res.status(200).json({
                success: true,
                message: "signup successful",
                token: result.token,
                user: result.user
            });
        } catch (error: any) {
            console.error('POST /api/auth/signup error:', error);
            
            // Return appropriate error messages
            let statusCode = 400;
            let errorMessage = error.message || 'Failed to create user';
            
            // Handle user already exists errors
            if (this.isUserExistsError(error.message)) {
                statusCode = 409;
                errorMessage = "User already exists";
            }
            
            // Handle validation errors from createUser
            if (this.isValidationError(error.message)) {
                statusCode = 400;
                errorMessage = error.message;
            }

            // Handle server errors
            if (this.isServerError(error.message)) {
                statusCode = 500;
                errorMessage = "Internal server error";
            }

            // Handle referral code errors
            if (this.isReferralError(error.message)) {
                statusCode = 400;
                errorMessage = "Invalid referral code";
            }
            
            res.status(statusCode).json({
                success: false,
                error: errorMessage 
            });
        }
    }
   

    private validateSignUpInput(req: Request): string | null {
        // Check if request body exists and is an object
        if (!req.body) {
            return "Request body is required";
        }

        if (typeof req.body !== 'object' || Array.isArray(req.body) || req.body === null) {
            return "Request body is required";
        }

        const { fullName, username, email, password, referallCode } = req.body;

        // Check for required fields - exact match with test expectations
        if (!req.body){
            return "Request body is required";
        }
        // Check for null/undefined values - exact match with test expectations
        if (fullName === null || fullName === undefined) {
            return "Full name cannot be null or undefined";
        }
        if (username === null || username === undefined) {
            return "Username cannot be null or undefined";
        }
        if (email === null || email === undefined) {
            return "Email cannot be null or undefined";
        }
        if (password === null || password === undefined) {
            return "Password cannot be null or undefined";
        }

        if (!req.body.hasOwnProperty('fullName')) {
            return "FullName is required";
        }
        if (!req.body.hasOwnProperty('username')) {
            return "Username is required";
        }
        if (!req.body.hasOwnProperty('email')) {
            return "Email is required";
        }
        if (!req.body.hasOwnProperty('password')) {
            return "Password is required";
        }


        // Check data types - exact match with test expectations
        if (typeof fullName !== 'string') {
            return "Full name must be a string";
        }
        if (typeof username !== 'string') {
            return "Username must be a string";
        }
        if (typeof email !== 'string') {
            return "Email must be a string";
        }
        if (typeof password !== 'string') {
            return "Password must be a string";
        }

        // Check for empty strings (including whitespace-only strings)
        if (fullName.trim() === '') {
            return "Full name cannot be empty";
        }
        if (username.trim() === '') {
            return "Username cannot be empty";
        }
        if (email.trim() === '') {
            return "Email cannot be empty";
        }
        if (password.trim() === '') {
            return "Password cannot be empty";
        }

        // Validate referral code if provided
        if (referallCode !== undefined && referallCode !== null) {
            if (typeof referallCode !== 'string') {
                return "Referral code must be a string";
            }
            if (referallCode.trim() === '') {
                return "Referral code cannot be empty if provided";
            }
            if (referallCode.length < 3 || referallCode.length > 20) {
                return "Referral code must be between 3 and 20 characters";
            }
        }

        // Length constraints - exact match with test expectations
        if (fullName.length < 2) {
            return "Full name must be at least 2 characters long";
        }
        if (fullName.length > 100) {
            return "Full name is too long (maximum 100 characters)";
        }
        if (username.length < 3) {
            return "Username must be at least 3 characters long";
        }
        if (username.length > 50) {
            return "Username is too long (maximum 50 characters)";
        }
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (password.length > 100) {
            return "Password is too long (maximum 100 characters)";
        }

        // Email validation
        if (!this.isValidEmail(email)) {
            return "Please provide a valid email address";
        }
        if (email.length > 254) {
            return "Email is too long (maximum 254 characters)";
        }

        // Username format validation
        if (!this.isValidUsername(username)) {
            return "Username can only contain letters, numbers, and underscores";
        }

        // Password strength validation
        const passwordValidation = this.validatePasswordStrength(password);
        if (passwordValidation) {
            return passwordValidation;
        }

        return null; // No validation errors
    }

    private isValidEmail(email: string): boolean {
        // More comprehensive email validation to match test cases
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Check for spaces
        if (email.includes(' ')) {
            return false;
        }
        
        // Check for missing parts
        if (!email.includes('@')) {
            return false;
        }
        
        const parts = email.split('@');
        if (parts.length !== 2) {
            return false;
        }
        
        const [localPart, domainPart] = parts;
        
        // Check for empty local part or domain part
        if (!localPart || !domainPart) {
            return false;
        }
        
        // Check if domain has at least one dot
        if (!domainPart.includes('.')) {
            return false;
        }
        
        return emailRegex.test(email);
    }

    private isValidUsername(username: string): boolean {
        // Username can only contain letters, numbers, and underscores
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        return usernameRegex.test(username);
    }

    private validatePasswordStrength(password: string): string | null {
        // Password strength requirements - exact match with test expectations
        if (!/(?=.*[a-z])/.test(password)) {
            return "Password must contain at least one lowercase letter";
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return "Password must contain at least one uppercase letter";
        }
        if (!/(?=.*\d)/.test(password)) {
            return "Password must contain at least one number";
        }
        if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
            return "Password must contain at least one special character";
        }

        return null;
    }

    private isUserExistsError(errorMessage: string): boolean {
        if (!errorMessage) return false;
        
        const existsErrors = [
            "user already exists",
            "email already exists", 
            "username already taken",
            "duplicate user",
            "user exists",
            "already registered"
        ];
        
        return existsErrors.some(error => 
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
            "cannot be null",
            "invalid email",
            "invalid username"
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

    private isReferralError(errorMessage: string): boolean {
        if (!errorMessage) return false;
        
        const referralErrors = [
            "invalid referral",
            "referral not found",
            "referral code",
            "invalid code"
        ];
        
        return referralErrors.some(error => 
            errorMessage.toLowerCase().includes(error.toLowerCase())
        );
    }
}

export const signUpHandler = new SignUpHandler();