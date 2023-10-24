import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ServerService } from './server.service';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../interface/custom-response';

describe('ServerService', () => {
  let service: ServerService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServerService],
    });

    service = TestBed.inject(ServerService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a list of servers', () => {
    const dummyResponse = {
      message: 'Data loaded successfully',
      data: { servers: [] },
      timeStamp: new Date(),
      statusCode: 200,
      status: 'Success',
      reason: 'Mock Reason',
      developerMessage: 'This is a mock response for testing',
    };

    service.servers$.subscribe((response) => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/server/list`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should save a server', () => {
    const server = {
      id: 1,
      ipAddress: '192.168.0.1',
      name: 'Server 1',
      memory: '8GB',
      type: 'Virtual',
      imageUrl: 'server-image.jpg', 
      status: Status.SERVER_UP,
    };

    const dummyResponse = {
      message: 'Server saved successfully',
      data: { server },
      timeStamp: new Date(),
      statusCode: 200,
      status: 'Success',
      reason: 'Mock Reason',
      developerMessage: 'This is a mock response for testing',
    };

    service.save$(server).subscribe((response) => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/server/save`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);
  });

  it('should ping a server', () => {
    const ipAddress = '192.168.0.1';
  
    const dummyResponse = {
      message: 'Server pinged successfully',
      data: { server: { id: 1, ipAddress: '192.168.0.1', name: 'Server 1' } },
      timeStamp: new Date(),
      statusCode: 200,
      status: 'Success',
      reason: 'Mock Reason',
      developerMessage: 'This is a mock response for testing',
    };
  
    service.ping$(ipAddress).subscribe((response) => {
      
      expect(response.message).toBe(dummyResponse.message);
      expect(response.data.server.id).toBe(dummyResponse.data.server.id);
      expect(response.data.server.ipAddress).toBe(dummyResponse.data.server.ipAddress);
      expect(response.data.server.name).toBe(dummyResponse.data.server.name);
    });
  
    const req = httpTestingController.expectOne(`${service['apiUrl']}/server/ping/${ipAddress}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });
  
  it('should filter servers', (done) => {
    const status = Status.SERVER_UP;

    const dummyResponse: CustomResponse = {
      message: `No servers of ${Status[status]} found`,
      data: { servers: [] },
      timeStamp: new Date(),
      statusCode: 200,
      status: 'Success',
      reason: 'Mock Reason',
      developerMessage: 'This is a mock response for testing',
    };

    service.filter$(status, dummyResponse).subscribe((response) => {
      expect(response.message).toContain('No servers of SERVER_UP found');
      done();
    });
  });
  

  it('should delete a server', () => {
    const serverId = 1;

    const dummyResponse = {
      message: 'Server deleted successfully',
      data: { servers: [] },
      timeStamp: new Date(),
      statusCode: 200,
      status: 'Success',
      reason: 'Mock Reason',
      developerMessage: 'This is a mock response for testing',
    };

    service.delete$(serverId).subscribe((response) => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(`${service['apiUrl']}/server/delete/${serverId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyResponse);
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
