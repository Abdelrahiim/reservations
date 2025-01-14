import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Events } from '@app/common';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern(Events.NOTIFICATION_EMAIL)
  @UsePipes(new ValidationPipe())
  public async sendNotificationEmail(@Payload() data: NotifyEmailDto) {
    return await this.notificationsService.sendNotificationEmail(data);
  }
}
