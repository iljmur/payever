import { Controller, Get, Delete, Param } from '@nestjs/common';
import { AvatarService } from './avatar.service';

@Controller('api/user/:id/avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Get()
  async getAvatar(@Param('id') id: string): Promise<any> {
    const base64Code = await this.avatarService.getAvatar(id);
    return { data: base64Code };
  }

  @Delete()
  async deleteAvatar(@Param('id') id: string): Promise<any> {
    await this.avatarService.deleteAvatar(id);
    return { status: 'success', message: 'Avatar has been deleted.' };
  }
}
