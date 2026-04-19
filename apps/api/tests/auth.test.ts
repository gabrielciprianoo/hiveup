import request from 'supertest';
import mongoose from 'mongoose';
import app from '../tests/server';
import User from '../src/models/User';
import Token from '../src/models/Token';

jest.mock('../src/services/email', () => ({
  sendConfirmationEmail: jest.fn().mockResolvedValue(undefined),
}));

import { sendConfirmationEmail } from '../src/services/email';

const validUser = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
};

describe('Auth API', () => {
  describe('POST /auth/create-account', () => {
    it('should create account with valid data', async () => {
      const res = await request(app).post('/auth/create-account').send(validUser);
      expect(res.status).toBe(201);
      expect(res.body.message).toBeDefined();
    });

    it('should save user to database', async () => {
      await request(app).post('/auth/create-account').send(validUser);
      const user = await User.findOne({ email: 'john@example.com' });
      expect(user).not.toBeNull();
    });

    it('should hash the password', async () => {
      await request(app).post('/auth/create-account').send(validUser);
      const user = await User.findOne({ email: 'john@example.com' });
      expect(user?.password).not.toBe(validUser.password);
    });

    it('should create user with confirmed = false', async () => {
      await request(app).post('/auth/create-account').send(validUser);
      const user = await User.findOne({ email: 'john@example.com' });
      expect(user?.confirmed).toBe(false);
    });

    it('should create a token linked to the user', async () => {
      await request(app).post('/auth/create-account').send(validUser);
      const user = await User.findOne({ email: 'john@example.com' });
      const token = await Token.findOne({ user: user?._id });
      expect(token).not.toBeNull();
      expect(token?.token).toHaveLength(6);
    });

    it('should send a confirmation email', async () => {
      await request(app).post('/auth/create-account').send(validUser);
      expect(sendConfirmationEmail).toHaveBeenCalledWith(
        expect.objectContaining({ to: 'john@example.com' })
      );
    });

    it('should return 409 when email already exists', async () => {
      await request(app).post('/auth/create-account').send(validUser);
      const res = await request(app).post('/auth/create-account').send(validUser);
      expect(res.status).toBe(409);
    });

    it('should return 400 when name is missing', async () => {
      const res = await request(app)
        .post('/auth/create-account')
        .send({ email: 'john@example.com', password: 'password123' });
      expect(res.status).toBe(400);
    });

    it('should return 400 when email is invalid', async () => {
      const res = await request(app)
        .post('/auth/create-account')
        .send({ ...validUser, email: 'not-an-email' });
      expect(res.status).toBe(400);
    });

    it('should return 400 when password is too short', async () => {
      const res = await request(app)
        .post('/auth/create-account')
        .send({ ...validUser, password: '123' });
      expect(res.status).toBe(400);
    });

    it('should return 500 when database throws', async () => {
      jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('DB error'));
      const res = await request(app).post('/auth/create-account').send(validUser);
      expect(res.status).toBe(500);
    });
  });

  describe('POST /auth/confirm-account', () => {
    let tokenValue: string;

    beforeEach(async () => {
      await request(app).post('/auth/create-account').send(validUser);
      const user = await User.findOne({ email: 'john@example.com' });
      const token = await Token.findOne({ user: user?._id });
      tokenValue = token!.token;
    });

    it('should confirm account with valid token', async () => {
      const res = await request(app)
        .post('/auth/confirm-account')
        .send({ token: tokenValue });
      expect(res.status).toBe(201);
    });

    it('should set user.confirmed to true', async () => {
      await request(app).post('/auth/confirm-account').send({ token: tokenValue });
      const user = await User.findOne({ email: 'john@example.com' });
      expect(user?.confirmed).toBe(true);
    });

    it('should delete token after confirmation', async () => {
      await request(app).post('/auth/confirm-account').send({ token: tokenValue });
      const token = await Token.findOne({ token: tokenValue });
      expect(token).toBeNull();
    });

    it('should return 401 for invalid token', async () => {
      const res = await request(app)
        .post('/auth/confirm-account')
        .send({ token: '000000' });
      expect(res.status).toBe(401);
    });

    it('should return 400 when token is missing', async () => {
      const res = await request(app).post('/auth/confirm-account').send({});
      expect(res.status).toBe(400);
    });

    it('should not allow reuse of the same token', async () => {
      await request(app).post('/auth/confirm-account').send({ token: tokenValue });
      const res = await request(app)
        .post('/auth/confirm-account')
        .send({ token: tokenValue });
      expect(res.status).toBe(401);
    });

    it('should return 401 when token exists but user does not', async () => {
      const orphanToken = new Token();
      orphanToken.token = '999999';
      orphanToken.user = new mongoose.Types.ObjectId() as any;
      await orphanToken.save();

      const res = await request(app).post('/auth/confirm-account').send({ token: '999999' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Usuario no encontrado');
    });

    it('should return 500 when database throws', async () => {
      jest.spyOn(Token, 'findOne').mockRejectedValueOnce(new Error('DB error'));
      const res = await request(app).post('/auth/confirm-account').send({ token: tokenValue });
      expect(res.status).toBe(500);
    });
  });
});
