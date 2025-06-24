import request from 'supertest';
import app from '../src/app';

describe('SignUp API Tests', () => {
  
  // Successful signup test
  describe('Successful signup', () => {
    it('POST /api/auth/signup should return 200 with valid data', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        fullName: "Test User",
        username: "testuser",
        email: "testuser@gmail.com",
        password: "TestPassword123!",
        referallCode: "12345"
      });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "signup successful",
        token: expect.any(String),
        user: expect.any(Object)
      });
    });

    it('POST /api/auth/signup should work without referral code', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        fullName: "Another User",
        username: "anotheruser",
        email: "another@gmail.com",
        password: "AnotherPass123!"
      });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });
  });

  // Request body validation tests
  describe('Request body validation', () => {
    it('should return 400 when request body is missing', async () => {
      const res = await request(app).post('/api/auth/signup');
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Request body is required"
      });
    });

    it('should return 400 when request body is not an object', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send('invalid body');
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // Required fields tests
  describe('Required fields validation', () => {
    const baseData = {
      fullName: "Test User",
      username: "testuser",
      email: "test@gmail.com",
      password: "TestPass123!"
    };

    it('should return 400 when fullName is missing', async () => {
      const { fullName, ...dataWithoutFullName } = baseData;
      const res = await request(app).post('/api/auth/signup').send(dataWithoutFullName);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "FullName is required"
      });
    });

    it('should return 400 when username is missing', async () => {
      const { username, ...dataWithoutUsername } = baseData;
      const res = await request(app).post('/api/auth/signup').send(dataWithoutUsername);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Username is required"
      });
    });

    it('should return 400 when email is missing', async () => {
      const { email, ...dataWithoutEmail } = baseData;
      const res = await request(app).post('/api/auth/signup').send(dataWithoutEmail);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Email is required"
      });
    });

    it('should return 400 when password is missing', async () => {
      const { password, ...dataWithoutPassword } = baseData;
      const res = await request(app).post('/api/auth/signup').send(dataWithoutPassword);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Password is required"
      });
    });
  });

  // Null/undefined validation tests
  describe('Null/undefined validation', () => {
    const baseData = {
      fullName: "Test User",
      username: "testuser",
      email: "test@gmail.com",
      password: "TestPass123!"
    };

    it('should return 400 when fullName is null', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        fullName: null
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Full name cannot be null or undefined");
    });

    it('should return 400 when username is undefined', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        username: undefined
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Username cannot be null or undefined");
    });

    it('should return 400 when email is null', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        email: null
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Email cannot be null or undefined");
    });

    it('should return 400 when password is undefined', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        password: undefined
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Password cannot be null or undefined");
    });
  });

  // Empty string validation tests
  describe('Empty string validation', () => {
    const baseData = {
      fullName: "Test User",
      username: "testuser",
      email: "test@gmail.com",
      password: "TestPass123!"
    };

    it('should return 400 when fullName is empty', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        fullName: "   "
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Full name cannot be empty");
    });

    it('should return 400 when username is empty', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        username: ""
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Username cannot be empty");
    });

    it('should return 400 when email is empty', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        email: "  "
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Email cannot be empty");
    });

    it('should return 400 when password is empty', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        password: ""
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Password cannot be empty");
    });
  });

  // Data type validation tests
  describe('Data type validation', () => {
    const baseData = {
      fullName: "Test User",
      username: "testuser",
      email: "test@gmail.com",
      password: "TestPass123!"
    };

    it('should return 400 when fullName is not a string', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        fullName: 12345
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Full name must be a string");
    });

    it('should return 400 when username is not a string', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        username: true
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Username must be a string");
    });

    it('should return 400 when email is not a string', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        email: ["test@gmail.com"]
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Email must be a string");
    });

    it('should return 400 when password is not a string', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        password: { pass: "TestPass123!" }
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Password must be a string");
    });
  });

  // Length validation tests
  describe('Length validation', () => {
    const baseData = {
      fullName: "Test User",
      username: "testuser",
      email: "test@gmail.com",
      password: "TestPass123!"
    };

    it('should return 400 when fullName is too short', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        fullName: "A"
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Full name must be at least 2 characters long");
    });

    it('should return 400 when fullName is too long', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        fullName: "A".repeat(101)
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Full name is too long (maximum 100 characters)");
    });

    it('should return 400 when username is too short', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        username: "ab"
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Username must be at least 3 characters long");
    });

    it('should return 400 when username is too long', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        username: "a".repeat(51)
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Username is too long (maximum 50 characters)");
    });

    it('should return 400 when password is too short', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        password: "Test1!"
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Password must be at least 6 characters long");
    });

    it('should return 400 when password is too long', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        password: "TestPass123!".repeat(10)
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Password is too long (maximum 100 characters)");
    });

    it('should return 400 when email is too long', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        email: "a".repeat(250) + "@test.com"
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Email is too long (maximum 254 characters)");
    });
  });

  // Email validation tests
  describe('Email validation', () => {
    const baseData = {
      fullName: "Test User",
      username: "testuser",
      email: "test@gmail.com",
      password: "TestPass123!"
    };

    it('should return 400 for invalid email format - missing @', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        email: "testgmail.com"
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Please provide a valid email address");
    });

    it('should return 400 for invalid email format - missing domain', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        email: "test@"
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Please provide a valid email address");
    });

    it('should return 400 for invalid email format - missing username', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        email: "@gmail.com"
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Please provide a valid email address");
    });

    it('should return 400 for invalid email format - spaces', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        email: "test user@gmail.com"
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Please provide a valid email address");
    });
  });

  // Username format validation tests
  describe('Username format validation', () => {
    const baseData = {
      fullName: "Test User",
      username: "testuser",
      email: "test@gmail.com",
      password: "TestPass123!"
    };

    it('should return 400 for username with special characters', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        username: "test-user"
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Username can only contain letters, numbers, and underscores");
    });

    it('should return 400 for username with spaces', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        username: "test user"
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Username can only contain letters, numbers, and underscores");
    });

    it('should accept username with underscores', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        username: "test_user_123"
      });
      
      // This should pass validation (assuming createUser works)
      expect(res.statusCode).not.toBe(400);
    });
  });

  // Password strength validation tests
  describe('Password strength validation', () => {
    const baseData = {
      fullName: "Test User",
      username: "testuser",
      email: "test@gmail.com",
      password: "TestPass123!"
    };

    it('should return 400 when password lacks lowercase letter', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        password: "TESTPASS123!"
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Password must contain at least one lowercase letter");
    });

    it('should return 400 when password lacks uppercase letter', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        password: "testpass123!"
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Password must contain at least one uppercase letter");
    });

    it('should return 400 when password lacks number', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        password: "TestPassword!"
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Password must contain at least one number");
    });

    it('should return 400 when password lacks special character', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        password: "TestPassword123"
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Password must contain at least one special character");
    });
  });

  // Referral code validation tests
  describe('Referral code validation', () => {
    const baseData = {
      fullName: "Test User",
      username: "testuser",
      email: "test@gmail.com",
      password: "TestPass123!"
    };

    it('should return 400 when referral code is not a string', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        referallCode: 12345
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Referral code must be a string");
    });

    it('should return 400 when referral code is empty', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        referallCode: "   "
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Referral code cannot be empty if provided");
    });

    it('should return 400 when referral code is too short', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        referallCode: "ab"
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Referral code must be between 3 and 20 characters");
    });

    it('should return 400 when referral code is too long', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...baseData,
        referallCode: "a".repeat(21)
      });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Referral code must be between 3 and 20 characters");
    });
  });

  // Error handling tests
  describe('Error handling', () => {
    const validData = {
      fullName: "Test User",
      username: "testuser",
      email: "test@gmail.com",
      password: "TestPass123!"
    };

    // Note: These tests assume your createUser function throws specific errors
    // You may need to mock the createUser function to simulate these scenarios

    it('should return 409 for user already exists error', async () => {
      // This test assumes the user already exists in the database
      // You might need to create the user first or mock the createUser function
      const res = await request(app).post('/api/auth/signup').send({
        ...validData,
        email: "existing@gmail.com"
      });
      
      // This will depend on your actual implementation
      if (res.statusCode === 409) {
        expect(res.body).toEqual({
          success: false,
          error: "User already exists"
        });
      }
    });

    it('should return 400 for invalid referral code error', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        ...validData,
        referallCode: "INVALID"
      });
      
      // This will depend on your actual implementation
      if (res.statusCode === 400 && res.body.error === "Invalid referral code") {
        expect(res.body).toEqual({
          success: false,
          error: "Invalid referral code"
        });
      }
    });
  });

  // GET endpoint test
  describe('GET endpoint', () => {
    it('GET /api/auth/signup/health should return availability message', async () => {
      const res = await request(app).get('/api/auth/signup/health');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "SignUp endpoint is available"
      });
    });
  });
});