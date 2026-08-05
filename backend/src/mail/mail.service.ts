import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendPasswordResetEmail(
    recipientEmail: string,
    resetToken: string,
  ): Promise<void> {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ??
      'http://localhost:5173';

    const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(
      resetToken,
    )}`;

    try {
      await this.mailerService.sendMail({
        to: recipientEmail,
        subject: 'CampusOps Password Reset',
        text: `
You requested a password reset for your CampusOps account.

Use the following link to reset your password:
${resetUrl}

This link will expire in 15 minutes.

If you did not request this password reset, you can ignore this email.
        `.trim(),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>CampusOps Password Reset</h2>

            <p>You requested a password reset for your CampusOps account.</p>

            <p>
              Click the button below to create a new password.
            </p>

            <p style="margin: 24px 0;">
              <a
                href="${resetUrl}"
                style="
                  display: inline-block;
                  padding: 12px 20px;
                  background-color: #111827;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 6px;
                "
              >
                Reset Password
              </a>
            </p>

            <p>This link will expire in 15 minutes.</p>

            <p>
              If you did not request this password reset, you can ignore this
              email.
            </p>

            <p>CampusOps</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Password reset email could not be sent:', error);

      throw new InternalServerErrorException(
        'Password reset email could not be sent.',
      );
    }
  }
}