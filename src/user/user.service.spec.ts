import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

describe('UserService', () => {
  let service: UserService

  const userModelMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    exec: jest.fn(),
  };
  
  (global as any).fetch = jest.fn()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,
        {
            provide: getModelToken(User.name),
            useValue: userModelMock,
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('image base64 encoding', () => {
    it('should be valid base64 string', () => {
        expect(service.isBase64('SGVsbG8gV29ybGQ=')).toBe(true)
        expect(service.isBase64('SGVsbG8gV29ybGQ')).toBe(false) // (missing padding character)
        expect(service.isBase64('SGVsbG8gV29ybGQ$')).toBe(false) // (contains invalid character)
        expect(service.isBase64('1234567890')).toBe(false) // (not Base64 encoded)
    })
  })
})