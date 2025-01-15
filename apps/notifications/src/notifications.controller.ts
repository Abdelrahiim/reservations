import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
  Empty,
  Notification,
  NotificationsServiceController,
  NotificationsServiceControllerMethods,
} from '@app/common';
import { Observable } from 'rxjs';

@Controller()
@NotificationsServiceControllerMethods()
export class NotificationsController implements NotificationsServiceController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  public sendNotification(
    data: Notification,
  ): Promise<Empty> | Observable<Empty> | Empty {
    return this.notificationsService.sendNotificationEmail(data);
  }
}
