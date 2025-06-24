import request from 'supertest';
import app from '../src/app';

describe('Auth API - /api/auth/login', () => {
  describe('Successful Login', () => {
    it('should return 200 with success response and token for valid credentials', async () => {
      const validCredentials = {
        username: "testuser",
        password: "testpassword"
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(validCredentials);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "Login successful",
        token: expect.any(String)
      });
      expect(res.body.token).toBeTruthy();
      expect(res.body.token.length).toBeGreaterThan(0);
    });
  });

  describe('Input Validation Failures', () => {
    it('should return 400 for null password', async () => {
      const invalidCredentials = {
        username: "testuser",
        password: null
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Password cannot be null or undefined"
      });
    });

    it('should return 400 for null username', async () => {
      const invalidCredentials = {
        username: null,
        password: "testpassword"
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Username cannot be null or undefined"
      });
    });

    it('should return 400 for both null username and password', async () => {
      const invalidCredentials = {
        username: null,
        password: null
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Username cannot be null or undefined"
      });
    });

    it('should return 400 for empty string username', async () => {
      const invalidCredentials = {
        username: "",
        password: "testpassword"
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Username cannot be empty"
      });
    });

    it('should return 400 for empty string password', async () => {
      const invalidCredentials = {
        username: "testuser",
        password: ""
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Password cannot be empty"
      });
    });

    it('should return 401 for wrong username', async () => {
      const invalidCredentials = {
        username: "wronguser",
        password: "testpassword"
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        success: false,
        error: "Invalid email or password"
      });
    });

    it('should return 401 for wrong password', async () => {
      const invalidCredentials = {
        username: "testuser",
        password: "wrongpassword"
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        success: false,
        error: "Invalid email or password"
      });
    });

    it('should return 400 for undefined credentials', async () => {
      const invalidCredentials = {
        username: undefined,
        password: undefined
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Username cannot be null or undefined"
      });
    });

    it('should return 400 for whitespace-only username', async () => {
      const whitespaceUsername = "   ";
      const credentials = {
        username: whitespaceUsername,
        password: "testpassword"
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Username cannot be empty"
      });
    });

    it('should return 400 for whitespace-only password', async () => {
      const whitespacePassword = "   ";
      const credentials = {
        username: "testuser",
        password: whitespacePassword
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Password cannot be empty"
      });
    });

    it('should return 400 for very long username', async () => {
      const longUsername = 'a'.repeat(1000);
      const credentials = {
        username: longUsername,
        password: "testpassword"
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Username is too long (maximum 100 characters)"
      });
    });

    it('should return 400 for very long password', async () => {
      const longPassword = 'a'.repeat(1000);
      const credentials = {
        username: "testuser",
        password: longPassword
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Password is too long (maximum 100 characters)"
      });
    });

    it('should return 400 for username too short', async () => {
      const shortUsername = "ab";
      const credentials = {
        username: shortUsername,
        password: "testpassword"
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Username must be at least 3 characters long"
      });
    });

    it('should return 400 for password too short', async () => {
      const shortPassword = "12345";
      const credentials = {
        username: "testuser",
        password: shortPassword
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Password must be at least 6 characters long"
      });
    });
  });

  describe('Authentication Failures', () => {
    it('should return 400 for missing request body', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send();

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Request body is required"
      });
    });

    it('should return 400 for missing username field', async () => {
      const incompleteCredentials = {
        password: "testpassword"
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(incompleteCredentials);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Username is required"
      });
    });

    it('should return 400 for missing password field', async () => {
      const incompleteCredentials = {
        username: "testuser"
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(incompleteCredentials);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        error: "Password is required"
      });
    });

    it('should return 400 for invalid JSON', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .type('json')
        .send('{"username": "testuser", "password":}'); // Invalid JSON

      expect(res.statusCode).toBe(400);
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in username', async () => {
      const specialUsername = "test@user!#$%";
      const credentials = {
        username: specialUsername,
        password: "testpassword"
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        success: false,
        error: "Invalid email or password"
      });
    });

    it('should handle special characters in password', async () => {
      const specialPassword = "test@pass!#$%";
      const credentials = {
        username: "testuser",
        password: specialPassword
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        success: false,
        error: "Invalid email or password"
      });
    });
  });

  describe('Content Type Handling', () => {
    it('should handle application/json content type', async () => {
      const credentials = {
        username: "testuser",
        password: "testpassword"
      };

      const res = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(credentials);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
    });

    it('should reject non-JSON content types', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'text/plain')
        .send('username=testuser&password=testpassword');

      expect(res.statusCode).toBe(400);
    });
  });

  describe('Security Tests', () => {
    it('should not return sensitive information in error responses', async () => {
      const credentials = {
        username: "testuser",
        password: "wrongpassword"
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(res.statusCode).toBe(401);
      expect(res.body.error).not.toContain('password');
      expect(res.body.error).not.toContain('hash');
      expect(res.body.error).not.toContain('database');
    });

    it('should have consistent response time for valid and invalid credentials', async () => {
      const validCredentials = {
        username: "testuser",
        password: "testpassword"
      };
      
      const invalidCredentials = {
        username: "testuser",
        password: "wrongpassword"
      };

      const start1 = Date.now();
      await request(app).post('/api/auth/login').send(validCredentials);
      const time1 = Date.now() - start1;

      const start2 = Date.now();
      await request(app).post('/api/auth/login').send(invalidCredentials);
      const time2 = Date.now() - start2;

      // Times should be reasonably close (within 100ms difference)
      expect(Math.abs(time1 - time2)).toBeLessThan(100);
    });
  });

  describe('Rate Limiting (if implemented)', () => {
    it('should handle multiple rapid requests gracefully', async () => {
      const credentials = {
        username: "testuser",
        password: "wrongpassword"
      };

      const requests = Array(5).fill(null).map(() => 
        request(app).post('/api/auth/login').send(credentials)
      );

      const responses = await Promise.all(requests);
      
      // All should return error responses
      responses.forEach(res => {
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
        expect(res.body).toHaveProperty('success', false);
      });
    });
  });
});