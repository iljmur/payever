import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from './schemas/user.schema';

describe('UserController', () => {
  let app: INestApplication
  let userService = {
    create: jest.fn(),
    findExternalUserById: jest.fn(),
    findByReqResId: jest.fn(),
    updateByReqResId: jest.fn(),
    deleteByReqResId: jest.fn(),
    fetchExternalUserAvatarAsBase64: jest.fn(),
    isBase64: jest.fn(),
  }
  let eventEmitter = { emit: jest.fn() }

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: EventEmitter2, useValue: eventEmitter },
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /api/users', () => {
    it('should create a user and emit events', async () => {
      const user = { id: '123', email: 'test@example.com' } as User
      userService.create.mockResolvedValue('success')

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send(user)

      expect(response.body).toEqual({
        status: 'success',
        message: 'User has been created.',
      })
      expect(userService.create).toHaveBeenCalledWith(user)
      expect(eventEmitter.emit).toHaveBeenCalledWith('user.registered.send.email', { email: 'test@example.com' })
      expect(eventEmitter.emit).toHaveBeenCalledWith('user.registered.send.message', { email: 'test@example.com' })
    })

    it('should return failed if user already exists', async () => {
      const user = { id: '123', email: 'test@example.com' } as User
      userService.create.mockResolvedValue('failed')

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send(user)

      expect(response.body).toEqual({
        status: 'failed',
        message: 'User already exists.',
      })
      expect(userService.create).toHaveBeenCalledWith(user)
    })
  })

  describe('GET /api/user/:id', () => {
    it('should return a user by id', async () => {
      const user = { id: '123', email: 'test@example.com' } as User
      userService.findExternalUserById.mockResolvedValue(user)

      const response = await request(app.getHttpServer())
        .get('/api/user/123')
        .expect(200)

      expect(response.body).toEqual({
        status: 'success',
        data: user,
      })
      expect(userService.findExternalUserById).toHaveBeenCalledWith('123')
    })
  })

  describe('GET /api/user/:id/avatar', () => {
    it('should return the user avatar if it is base64 encoded', async () => {
      const user = { id: '123', avatar: 'base64EncodedAvatar' } as User
      userService.findByReqResId.mockResolvedValue(user)
      userService.isBase64.mockReturnValue(true)

      const response = await request(app.getHttpServer())
        .get('/api/user/123/avatar')
        .expect(200)

      expect(response.body).toEqual({
        status: 'success',
        data: 'base64EncodedAvatar',
      })
      expect(userService.findByReqResId).toHaveBeenCalledWith('123')
      expect(userService.isBase64).toHaveBeenCalledWith('base64EncodedAvatar')
    })

    it('should fetch and update the user avatar if it is not base64 encoded', async () => {
      const user = { id: '123' } as User
      const externalUser = { id: '123', avatar: 'http://example.com/avatar.jpg' }
      const base64EncodedAvatar = 'base64EncodedAvatar'
      userService.findByReqResId.mockResolvedValue(user)
      userService.isBase64.mockReturnValue(false)
      userService.findExternalUserById.mockResolvedValue(externalUser)
      userService.fetchExternalUserAvatarAsBase64.mockResolvedValue(base64EncodedAvatar)
      userService.updateByReqResId.mockResolvedValue({ ...user, avatar: base64EncodedAvatar })

      const response = await request(app.getHttpServer())
        .get('/api/user/123/avatar')
        .expect(200)

      expect(response.body).toEqual({
        status: 'success',
        data: base64EncodedAvatar,
      })
      expect(userService.findByReqResId).toHaveBeenCalledWith('123')
      expect(userService.isBase64).toHaveBeenCalledWith(base64EncodedAvatar)
      expect(userService.findExternalUserById).toHaveBeenCalledWith('123')
      expect(userService.fetchExternalUserAvatarAsBase64).toHaveBeenCalledWith('http://example.com/avatar.jpg')
      expect(userService.updateByReqResId).toHaveBeenCalledWith('123', { ...user, avatar: base64EncodedAvatar })
    })

    it('should return an error if the user is not found', async () => {
      userService.findByReqResId.mockResolvedValue(null)

      const response = await request(app.getHttpServer())
        .get('/api/user/123/avatar')

      expect(response.body.status).toEqual('failed')
      expect(userService.findByReqResId).toHaveBeenCalledWith('123')
    })
  })

  describe('DELETE /api/user/:id/avatar', () => {
    it('should delete the user by id', async () => {
      const user = { id: '123', email: 'test@example.com' } as User
      userService.deleteByReqResId.mockResolvedValue(user)

      const response = await request(app.getHttpServer())
        .delete('/api/user/123/avatar')
        .expect(200)

      expect(response.body).toEqual({
        status: 'success',
        message: 'User has been deleted',
      })
      expect(userService.deleteByReqResId).toHaveBeenCalledWith('123')
    })

    it('should return an error if the user is not found', async () => {
      userService.deleteByReqResId.mockResolvedValue(null)

      const response = await request(app.getHttpServer())
        .delete('/api/user/123/avatar')
        .expect(200)

      expect(response.body).toEqual({
        status: 'failed',
        message: 'User with reqres id 123 not found',
      })
      expect(userService.deleteByReqResId).toHaveBeenCalledWith('123')
    })
  })
})
