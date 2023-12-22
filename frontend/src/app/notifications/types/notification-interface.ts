import { NotificationTypeEnum } from './notificationType.enum';

export interface NotificationInterface {
  type: NotificationTypeEnum;
  text: string;
}