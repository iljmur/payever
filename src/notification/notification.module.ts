import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { EmailListener } from './email/email.listener';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';
import { EventListener as RabbitMQListener } from './rabbitmq/rabbitmq.listener';

@Module({
  providers: [EmailService, EmailListener, RabbitMQService, RabbitMQListener],
})
export class NotificationModule {}
