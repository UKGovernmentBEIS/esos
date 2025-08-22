import { NotificationError } from '@tasks/notification/notification-errors/notification-errors';

const notificationErrorFactory = (errorFactory: () => NotificationError) => errorFactory();

export const notificationValidationError = notificationErrorFactory(() => new NotificationError(null));
