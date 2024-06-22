import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('api')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('users')
  async createUser(
    @Body()
    user: User,
  ): Promise<any> {
    const status = await this.userService.create(user);

    if (status === 'success') {
      this.eventEmitter.emit('user.registered.send.email', {
        email: user.email,
      });
      this.eventEmitter.emit('user.registered.send.message', {
        email: user.email,
      });
      return { status: 'success', message: 'User has been created.' };
    } else {
      throw new ConflictException({
        status: 'failed',
        message: 'User already exists.',
      });
    }
  }

  @Get('user/:id')
  async getUser(
    @Param('id')
    id: string,
  ): Promise<any> {
    const user = await this.userService.fetchExternalUserById(id);
    return { data: user };
  }
}
