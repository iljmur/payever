import { Test, TestingModule } from '@nestjs/testing';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';

describe('AvatarController', () => {
  let controller: AvatarController;
  let service: AvatarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvatarController],
      providers: [
        {
          provide: AvatarService,
          useValue: {
            getAvatar: jest.fn(),
            deleteAvatar: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AvatarController>(AvatarController);
    service = module.get<AvatarService>(AvatarService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAvatar', () => {
    it('should return the base64 encoded avatar', async () => {
      const base64Code = 'base64string';
      jest.spyOn(service, 'getAvatar').mockResolvedValue(base64Code);

      const result = await controller.getAvatar('1');
      expect(result).toEqual({ data: base64Code });
      expect(service.getAvatar).toHaveBeenCalledWith('1');
    });
  });

  describe('deleteAvatar', () => {
    it('should delete the avatar and return success message', async () => {
      jest.spyOn(service, 'deleteAvatar').mockResolvedValue(undefined);

      const result = await controller.deleteAvatar('1');
      expect(result).toEqual({
        status: 'success',
        message: 'Avatar has been deleted.',
      });
      expect(service.deleteAvatar).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if avatar does not exist', async () => {
      jest
        .spyOn(service, 'deleteAvatar')
        .mockRejectedValue(new Error('Avatar not found'));

      try {
        await controller.deleteAvatar('1');
      } catch (error) {
        expect(error.message).toBe('Avatar not found');
      }
    });
  });
});
