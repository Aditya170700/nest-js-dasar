import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import * as httpMock from 'node-mocks-http';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be say hello', async () => {
    const sayHello = await controller.sayHello('Erni Safitri');
    expect(sayHello).toBe('Hello Erni Safitri');
  });

  it('should be post', () => {
    const data = controller.post();
    expect(data).toBe('POST');
  });

  it('should can get view', () => {
    const response = httpMock.createResponse();
    controller.view('Aditya', response);

    expect(response._getRenderView()).toBe('index.html');
    expect(response._getRenderData()).toEqual({
      title: 'Template Engine',
      name: 'Aditya'
    });
  });
});
