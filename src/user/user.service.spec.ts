import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

const mockUserModel = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return success if user does not exist', async () => {
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      (model.create as jest.Mock).mockResolvedValue('created user');

      const result = await service.create({
        id: '1',
        email: 'test@example.com',
      } as User);
      expect(result).toEqual('success');
    });

    it('should return failed if user already exists', async () => {
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue({ id: '1', email: 'test@example.com' }),
      });

      const result = await service.create({
        id: '1',
        email: 'test@example.com',
      } as User);
      expect(result).toEqual('failed');
    });
  });

  describe('fetchExternalUserById', () => {
    it('should throw NotFoundException if user is not found', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
      });

      await expect(service.fetchExternalUserById('1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return user data if user is found', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest
          .fn()
          .mockResolvedValue({ data: { id: '1', email: 'test@example.com' } }),
      });

      const result = await service.fetchExternalUserById('1');
      expect(result).toEqual({ id: '1', email: 'test@example.com' });
    });
  });
});
