import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { DataState } from './enum/data-state.enum';
import { Status } from './enum/status.enum';
import { CustomResponse } from './interface/custom-response';
import { ServerService } from './service/server.service';
import { NotificationService } from './service/notification.service';
import { Server } from './interface/server';
import { take } from 'rxjs/operators';
import { NotifierModule } from 'angular-notifier';


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let serverService: jasmine.SpyObj<ServerService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    serverService = jasmine.createSpyObj('ServerService', [
      'servers$',
      'ping$',
      'save$',
      'filter$',
      'delete$',
    ]);
    notificationService = jasmine.createSpyObj('NotificationService', [
      'onDefault',
      'onError',
    ]);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [FormsModule,NotifierModule],
      providers: [
        { provide: ServerService, useValue: serverService },
        { provide: NotificationService, useValue: notificationService },
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize appState$ with data', waitForAsync(() => {
    const mockResponse: CustomResponse = {
      message: 'Data loaded successfully',
      data: { servers: [] },
      timeStamp: new Date(),
      statusCode: 200,
      status: 'Success',
      reason: 'Mock Reason',
      developerMessage: 'This is a mock response for testing',
    };
  
    // Don't need to spy on the observable; use of operator directly
    serverService.servers$.pipe(take(1)).subscribe(response => {
      expect(component.appState$).toBeDefined();
  
      component.appState$.subscribe(appState => {
        expect(appState.dataState).toBe(DataState.LOADED_STATE);
        expect(appState.appData).toEqual({
          ...mockResponse,
          data: { servers: mockResponse.data.servers.reverse() },
        });
      });
  
      // Trigger change detection
      fixture.detectChanges();
    });
  }));
  

  it('should ping a server', () => {
    const ipAddress = '192.168.0.1';
    const mockResponse: CustomResponse = {
      message: 'Server pinged successfully',
      data: {
        server: {
          id: 1,
          ipAddress,
          name: 'Server 1',
          memory: '16 GB', 
          type: 'Personal PC', 
          imageUrl: 'http://localhost:8080/server/image/server1.png', 
          status: Status.SERVER_UP, 
        },
      },
      timeStamp: new Date(),
      statusCode: 200,
      status: 'Success',
      reason: 'Mock Reason',
      developerMessage: 'This is a mock response for testing',
    };

    serverService.ping$.and.returnValue(of(mockResponse));

    component.pingServer(ipAddress);

    expect(serverService.ping$).toHaveBeenCalledWith(ipAddress);
    expect(notificationService.onDefault).toHaveBeenCalledWith(mockResponse.message);
  });

  it('should save a server', () => {
    const serverForm: NgForm = new NgForm([], []);
    serverForm.setValue({
      ipAddress: '192.168.1.58',
      name: 'Fedora Linux',
      memory: '16 GB',
      type: 'Dell Tower',
      status: Status.SERVER_UP,
    });

    const mockResponse: CustomResponse = {
      message: 'Server saved successfully',
      data: { server: { id: 2, ...serverForm.value } },
      timeStamp: new Date(),
      statusCode: 200, // Use the appropriate status code
      status: 'Success',
      reason: 'Mock Reason',
      developerMessage: 'This is a mock response for testing',
    };

    serverService.save$.and.returnValue(of(mockResponse));

    component.saveServer(serverForm);

    expect(serverService.save$).toHaveBeenCalledWith(serverForm.value);
    expect(notificationService.onDefault).toHaveBeenCalledWith(mockResponse.message);
  });

  it('should filter servers', () => {
    const status = Status.SERVER_UP;
    const mockResponse: CustomResponse = {
      message: 'Servers filtered successfully',
      data: { servers: [] },
      timeStamp: new Date(),
      statusCode: 200,
      status: 'Success',
      reason: 'Mock Reason',
      developerMessage: 'This is a mock response for testing',
    };

    serverService.filter$.and.returnValue(of(mockResponse));

    component.filterServers(status);

    component.appState$.subscribe((appState) => {
      expect(serverService.filter$).toHaveBeenCalledWith(status, appState.appData);
    });

    expect(notificationService.onDefault).toHaveBeenCalledWith(mockResponse.message);
  });

  it('should delete a server', () => {
    const server: Server = {
       id: 1,
       ipAddress: '192.168.0.3',
       name: 'Server 3',
       memory: '8GB',
       type: 'Virtual',
       imageUrl: 'server-image.jpg', 
       status: Status.SERVER_UP,
    };
    const now = new Date();
    const timeStamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
    const mockResponse: CustomResponse = {
       message: 'Server deleted successfully',
       data: { servers: [] },
       timeStamp: timeStamp,
       statusCode: 200, // Use the appropriate status code
       status: 'Success',
       reason: 'Mock Reason',
       developerMessage: 'This is a mock response for testing',
    };
    serverService.delete$.and.returnValue(of(mockResponse));
   
    component.deleteServer(server);
   
    expect(serverService.delete$).toHaveBeenCalledWith(server.id);
    expect(notificationService.onDefault).toHaveBeenCalledWith(mockResponse.message);
  });
});
