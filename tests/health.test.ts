import request from 'supertest';
import app from '../src/app';

describe('App', () => {
  it('GET /health should return 200 and status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ server:"carsle-auth",status: "OK"});
  });
});
