import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/user/user.service';
import { AvatarService } from '../src/avatar/avatar.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userService = {
    create: jest.fn(),
    fetchExternalUserById: jest.fn(),
  };
  let avatarService = {
    getAvatar: jest.fn(),
    deleteAvatar: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .overrideProvider(AvatarService)
      .useValue(avatarService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/api/users (POST)', () => {
    it('should create a user successfully', async () => {
      userService.create.mockResolvedValue('success');

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({ id: '1', email: 'test@example.com' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 'success',
        message: 'User has been created.',
      });
    });

    it('should return conflict when user already exists', async () => {
      userService.create.mockResolvedValue('failed');

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({ id: '1', email: 'test@example.com' });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        status: 'failed',
        message: 'User already exists.',
      });
    });
  });

  describe('/api/user/:id (GET)', () => {
    it('should return user data', async () => {
      const user = { id: '1', email: 'test@example.com' };
      userService.fetchExternalUserById.mockResolvedValue(user);

      const response = await request(app.getHttpServer()).get('/api/user/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: user });
    });

    it('should return not found when user does not exist', async () => {
      userService.fetchExternalUserById.mockRejectedValue(
        new NotFoundException(),
      );

      const response = await request(app.getHttpServer()).get('/api/user/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' });
    });
  });

  describe('/api/user/:id/avatar (GET)', () => {
    it('should return avatar base64 code', async () => {
      avatarService.getAvatar.mockResolvedValue('base64code');

      const response = await request(app.getHttpServer()).get(
        '/api/user/1/avatar',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: 'base64code' });
    });

    it('should return not found when avatar does not exist', async () => {
      avatarService.getAvatar.mockRejectedValue(new NotFoundException());

      const response = await request(app.getHttpServer()).get(
        '/api/user/1/avatar',
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' });
    });
  });

  describe('/api/user/:id/avatar (DELETE)', () => {
    it('should delete the avatar successfully', async () => {
      const avatar = { id: '1', path: 'path/to/avatar' };
      avatarService.deleteAvatar.mockResolvedValue(avatar);

      const response = await request(app.getHttpServer()).delete(
        '/api/user/1/avatar',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        message: 'Avatar has been deleted.',
      });
    });

    it('should return not found when avatar does not exist', async () => {
      avatarService.deleteAvatar.mockRejectedValue(new NotFoundException());

      const response = await request(app.getHttpServer()).delete(
        '/api/user/1/avatar',
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' });
    });
  });
});
