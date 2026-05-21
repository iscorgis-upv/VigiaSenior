import request from 'supertest';
import app from '../../src/app';

describe('GET /health', () => {
  it('returns 200 OK', async () => {
    await request(app).get('/health').expect(200);
  });

  it('returns a basic health response structure', async () => {
    const response = await request(app).get('/health').expect(200);

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: expect.any(String),
      }),
    );
    expect(response.body.status).toBe('ok');
  });
});
