import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Injectable()
export class NotificationsService {
  sendNotificationEmail(data: NotifyEmailDto) {
    console.log(
      '🚀 ~ NotificationsService ~ sendNotificationEmail ~ data:',
      data,
    );
    throw new Error('Method not implemented.');
  }
}
