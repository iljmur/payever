import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { EmailListener } from './email/email.listener';

@Module({
  providers: [EmailService, EmailListener]
})
export class NotificationModule {}
