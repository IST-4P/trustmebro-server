import { KeyConfiguration } from '@common/configurations/key.config';
import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private otpTemplate: string;

  constructor() {
    this.resend = new Resend(KeyConfiguration.RESEND_API_KEY);

    // Load template from dist/assets (works in both dev and production)
    const templatePath = path.join(__dirname, 'assets', 'otp.html');
    this.otpTemplate = fs.readFileSync(templatePath, 'utf-8');
  }

  sendVerificationCode(body: { email: string; code: string }) {
    return this.resend.emails.send({
      from: 'HacMieu TrustMeBro <no-reply@hacmieu.xyz>',
      to: [body.email],
      subject: 'Mã OTP',
      html: this.otpTemplate.replace(/\{\{code\}\}/g, body.code),
    });
  }
}
