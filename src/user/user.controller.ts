import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';

@Controller('api')
export class UserController {
    constructor(
        private userService: UserService
    ){}

    @Post('users')
    async createUser(
        @Body()
        user
    ): Promise<any> {
        const res = this.userService.create(user)
        return { status: 'success', data: res };
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

        return { status: 'success'}
    }

}