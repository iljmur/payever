import { AvatarService } from './avatar.service';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Avatar } from './schemas/avatar.schema';
import * as fs from 'fs';
import { NotFoundException } from '@nestjs/common';
import { SHA256, enc } from 'crypto-js';
import { Model } from 'mongoose';

class MockAvatarModel {
  constructor(public data: any) {}
  static findOne = jest.fn();
  static deleteOne = jest.fn();
  save = jest.fn();
}

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

describe('AvatarService', () => {
  let service: AvatarService;
  let model: Model<Avatar>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvatarService,
        {
          provide: getModelToken(Avatar.name),
          useValue: MockAvatarModel,
        },
      ],
    }).compile();

    service = module.get<AvatarService>(AvatarService);
    model = module.get<Model<Avatar>>(getModelToken(Avatar.name));
    process.env.REQRES_URI = 'http://mocked-reqres-uri';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAvatar', () => {
    it('should return base64 code if avatar exists in database', async () => {
      const id = '1';
      const base64code = 'base64string';
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({ base64code }),
      });

      const result = await service.getAvatar(id);
      expect(result).toBe(base64code);
      expect(model.findOne).toHaveBeenCalledWith({ id });
    });

    it('should fetch, save and return base64 code if avatar does not exist', async () => {
      const id = '1';
      const avatarUrl = 'http://example.com/avatar.png';
      const avatarImageBuffer = Buffer.from('image');
      const base64code = avatarImageBuffer.toString('base64');
      const hash = SHA256(enc.Base64.parse(base64code)).toString();
      const imageFileName = 'avatar.png';
      const path = `./avatars/${id}-${hash}-${imageFileName}`;

      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      global.fetch = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: { avatar: avatarUrl } }),
          }),
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            arrayBuffer: () => Promise.resolve(avatarImageBuffer),
          }),
        );

      const newAvatar = new MockAvatarModel({
        id,
        hash,
        path,
        base64code,
      });

      jest.spyOn(newAvatar, 'save').mockResolvedValue(null);

      const result = await service.getAvatar(id);
      expect(result).toBe(base64code);
      expect(model.findOne).toHaveBeenCalledWith({ id });
      expect(fs.writeFileSync).toHaveBeenCalledWith(path, avatarImageBuffer);
    });

    it('should throw NotFoundException if user fetch fails', async () => {
      const id = '1';
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
      });

      await expect(service.getAvatar(id)).rejects.toThrow(NotFoundException);
      expect(model.findOne).toHaveBeenCalledWith({ id });
    });

    it('should throw NotFoundException if image fetch fails', async () => {
      const id = '1';
      const avatarUrl = 'http://example.com/avatar.png';
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { avatar: avatarUrl } }),
      });
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
      });
      await expect(service.getAvatar(id)).rejects.toThrow(NotFoundException);
      expect(model.findOne).toHaveBeenCalledWith({ id });
    });
  });

  describe('deleteAvatar', () => {
    it('should delete the avatar if it exists', async () => {
      const id = '1';
      const avatar = { id, path: './avatars/avatar.png' };
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(avatar),
      });
      (model.deleteOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await service.deleteAvatar(id);
      expect(model.findOne).toHaveBeenCalledWith({ id });
      expect(fs.unlinkSync).toHaveBeenCalledWith(avatar.path);
      expect(model.deleteOne).toHaveBeenCalledWith({ id });
    });

    it('should throw NotFoundException if avatar does not exist', async () => {
      const id = '1';
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.deleteAvatar(id)).rejects.toThrow(NotFoundException);
      expect(model.findOne).toHaveBeenCalledWith({ id });
    });
  });

  describe('findExternalUserAvatarUrl', () => {
    it('should return the avatar URL', async () => {
      const id = '1';
      const avatarUrl = 'http://example.com/avatar.png';
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { avatar: avatarUrl } }),
      });

      const result = await service.findExternalUserAvatarUrl(id);
      expect(result).toBe(avatarUrl);
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.REQRES_URI}/api/users/${id}`,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      const id = '1';
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
      });

      await expect(service.findExternalUserAvatarUrl(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.REQRES_URI}/api/users/${id}`,
      );
    });
  });

  describe('fetchImage', () => {
    it('should return the image buffer', async () => {
      const url = 'http://example.com/avatar.png';
      const imageBuffer = Buffer.from('image');
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        arrayBuffer: () => Promise.resolve(imageBuffer),
      });

      const result = await service.fetchImage(url);
      expect(result).toEqual(imageBuffer);
      expect(global.fetch).toHaveBeenCalledWith(url);
    });

    it('should throw NotFoundException if image fetch fails', async () => {
      const url = 'http://example.com/avatar.png';
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
      });

      await expect(service.fetchImage(url)).rejects.toThrow(NotFoundException);
      expect(global.fetch).toHaveBeenCalledWith(url);
    });
  });

  describe('extractImageFileName', () => {
    it('should extract and return the image file name', () => {
      const url = 'http://example.com/avatar.png';
      const result = service.extractImageFileName(url);
      expect(result).toBe('avatar.png');
    });
  });

  describe('generateHash', () => {
    it('should generate and return the SHA256 hash of base64 code', () => {
      const base64code = 'aGVsbG8gd29ybGQ='; // 'hello world' in base64
      const expectedHash = SHA256(enc.Base64.parse(base64code)).toString();

      const result = service.generateHashFromBase64(base64code);
      expect(result).toBe(expectedHash);
    });
  });
});
