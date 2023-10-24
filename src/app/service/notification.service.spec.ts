import { TestBed } from '@angular/core/testing';
import { NotifierService } from 'angular-notifier';
import { NotificationService, Type } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let notifierService: jasmine.SpyObj<NotifierService>;

  beforeEach(() => {
    notifierService = jasmine.createSpyObj('NotifierService', ['notify']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: NotifierService, useValue: notifierService },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should notify with default type', () => {
    const message = 'Test Message';
    service.onDefault(message);
    expect(notifierService.notify).toHaveBeenCalledWith(Type.DEFAULT, message);
  });

  it('should notify with success type', () => {
    const message = 'Test Message';
    service.onSuccess(message);
    expect(notifierService.notify).toHaveBeenCalledWith(Type.SUCCESS, message);
  });

  it('should notify with info type', () => {
    const message = 'Test Message';
    service.onInfo(message);
    expect(notifierService.notify).toHaveBeenCalledWith(Type.INFO, message);
  });

  it('should notify with warning type', () => {
    const message = 'Test Message';
    service.onWarning(message);
    expect(notifierService.notify).toHaveBeenCalledWith(Type.WARNING, message);
  });

  it('should notify with error type', () => {
    const message = 'Test Message';
    service.onError(message);
    expect(notifierService.notify).toHaveBeenCalledWith(Type.ERROR, message);
  });
});
