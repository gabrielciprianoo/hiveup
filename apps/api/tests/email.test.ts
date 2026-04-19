import { sendConfirmationEmail, sendPasswordResetEmail } from '../src/services/email';

// Mock only the transporter, not the whole module — the real functions run and get covered
jest.mock('../src/config/nodemailer', () => ({
  transporter: { sendMail: jest.fn().mockResolvedValue({}) },
}));

import { transporter } from '../src/config/nodemailer';

const sendMail = transporter.sendMail as jest.Mock;

const params = { to: 'user@example.com', name: 'John', token: '123456' };

describe('Email service', () => {
  beforeEach(() => sendMail.mockClear());

  describe('sendConfirmationEmail', () => {
    it('should call sendMail once', async () => {
      await sendConfirmationEmail(params);
      expect(sendMail).toHaveBeenCalledTimes(1);
    });

    it('should send to the correct address', async () => {
      await sendConfirmationEmail(params);
      expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: params.to }));
    });

    it('should include the token in the html', async () => {
      await sendConfirmationEmail(params);
      const html: string = sendMail.mock.calls[0][0].html;
      expect(html).toContain(params.token);
    });

    it('should include the user name in the html', async () => {
      await sendConfirmationEmail(params);
      const html: string = sendMail.mock.calls[0][0].html;
      expect(html).toContain(params.name);
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should call sendMail once', async () => {
      await sendPasswordResetEmail(params);
      expect(sendMail).toHaveBeenCalledTimes(1);
    });

    it('should send to the correct address', async () => {
      await sendPasswordResetEmail(params);
      expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: params.to }));
    });

    it('should include the token in the html', async () => {
      await sendPasswordResetEmail(params);
      const html: string = sendMail.mock.calls[0][0].html;
      expect(html).toContain(params.token);
    });
  });
});
