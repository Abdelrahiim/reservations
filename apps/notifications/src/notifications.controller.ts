import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern } from '@nestjs/microservices';
import { Events } from '@app/common';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern(Events.NOTIFICATION_EMAIL)
  @UsePipes(new ValidationPipe())
  async sendNotificationEmail(data: NotifyEmailDto) {
    return this.notificationsService.sendNotificationEmail(data);
  }
}
