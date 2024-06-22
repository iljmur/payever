import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConflictException } from '@nestjs/common';
import { User } from './schemas/user.schema';

const mockUserService = () => ({
  create: jest.fn(),
  fetchExternalUserById: jest.fn(),
});

const mockEventEmitter = () => ({
  emit: jest.fn(),
});

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService() },
        { provide: EventEmitter2, useValue: mockEventEmitter() },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should return success message when user is created', async () => {
      (service.create as jest.Mock).mockResolvedValue('success');

      const result = await controller.createUser({
        id: '1',
        email: 'test@example.com',
      } as User);
      expect(result).toEqual({
        status: 'success',
        message: 'User has been created.',
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'user.registered.send.email',
        { email: 'test@example.com' },
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'user.registered.send.message',
        { email: 'test@example.com' },
      );
    });

    it('should throw ConflictException when user already exists', async () => {
      (service.create as jest.Mock).mockResolvedValue('failed');

      await expect(
        controller.createUser({ id: '1', email: 'test@example.com' } as User),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getUser', () => {
    it('should return user data', async () => {
      const user = { id: '1', email: 'test@example.com' };
      (service.fetchExternalUserById as jest.Mock).mockResolvedValue(user);

      const result = await controller.getUser('1');
      expect(result).toEqual({ data: user });
    });
  });
});
