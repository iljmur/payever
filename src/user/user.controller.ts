import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
 

@Controller('api')
export class UserController {
    constructor(
        private userService: UserService,
        private readonly eventEmitter: EventEmitter2
    ){}

    @Post('users')
    async createUser(
        @Body()
        user: User
    ): Promise<any> {
        const status = await this.userService.create(user)

        if (status === 'success') {
            this.eventEmitter.emit('user.registered.send.email', { email: user.email });
            return { status: 'success', message: 'User has been created.' }
        } else {
            return { status: 'failed', message: 'User already exists.' }
        }
        
    }

    @Get('user/:id')
    async getUser(
        @Param('id')
        id: string
    ): Promise<any> {
        const user = await this.userService.findExternalUserById(id)
        return { status: 'success', data: user };
    }

    @Get('user/:id/avatar')
    async getUserAvatar(
        @Param('id')
        id: string
    ): Promise<any> {
        const user = await this.userService.findByReqResId(id)
        if (!user) {
            return {
                status: 'failed',
                message: `User with reqres id:${id} not found, unable to proceed with updating avatar. 
                Please create a user first.`
            }
        }

        const isAvatarBase64Encoded = user.avatar? this.userService.isBase64(user.avatar) : false
        
        if (isAvatarBase64Encoded) {
            return { status: 'success', data: user.avatar };
        } else {
            const externalUser = await this.userService.findExternalUserById(id)
            if (!externalUser || !externalUser.avatar) {
                return {
                    status: 'failed',
                    message: `Unable to find reqres user with id:${id}`
                }
            }
            const base64EncodedAvatar = await this.userService.fetchExternalUserAvatarAsBase64(externalUser.avatar)
            let userCopy = JSON.parse(JSON.stringify(user))
            const modifiedUser = {... userCopy, avatar: base64EncodedAvatar}
            
            this.userService.updateByReqResId(id, modifiedUser )
            return { status: 'success', data: base64EncodedAvatar };
        }
    }

    @Delete('user/:id/avatar')
    async deleteUser(
        @Param('id')
        id: string
    ): Promise<any> {
        
        const deletedUser = await this.userService.deleteByReqResId(id);
        if (!deletedUser) {
            return { status: 'failed',
                    message: `User with reqres id ${id} not found`}
        }

        return { status: 'success', message: 'User has been deleted'}
    }

}