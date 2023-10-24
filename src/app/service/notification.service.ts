import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notifier: NotifierService;

  constructor(notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  // Display a default notification with the provided message
  onDefault(message: string): void {
    this.notifier.notify(Type.DEFAULT, message);
  }

  // Display a success notification with the provided message
  onSuccess(message: string): void {
    this.notifier.notify(Type.SUCCESS, message);
  }

  // Display an info notification with the provided message
  onInfo(message: string): void {
    this.notifier.notify(Type.INFO, message);
  }

  // Display a warning notification with the provided message
  onWarning(message: string): void {
    this.notifier.notify(Type.WARNING, message);
  }

  // Display an error notification with the provided message
  onError(message: string): void {
    this.notifier.notify(Type.ERROR, message);
  }
}

// Enum to define notification types
enum Type { 
  DEFAULT = 'default', 
  INFO = 'info', 
  SUCCESS = 'success', 
  WARNING = 'warning', 
  ERROR = 'error'
};

// Export the Type enum for use in other components or services
export { Type };
