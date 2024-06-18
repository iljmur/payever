import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';

@Controller('api')
export class UserController {
    constructor(
        private userService: UserService
    ){}

    @Get('users')
    async getAllUsers(): Promise<User[]> {
        return this.userService.findAll()
    }
}