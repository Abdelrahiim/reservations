import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.mailersend.net',
    port: 587,
    secure: false,
    auth: {
      user: this.configService.get<string>('SMTP_USER'),
      pass: this.configService.get<string>('SMTP_PASSWORD'),
    },
  });

  constructor(private readonly configService: ConfigService) {}

  sendNotificationEmail(data: NotifyEmailDto) {
    try {
      return this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_USER'),
        to: data.email,
        subject: 'Reservation Notification',
        text: data.text,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send notification email');
    }
  }
}
