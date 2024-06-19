import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { EmailListener } from './email/email.listener';
import { EventPublisherService } from './rabbitmq/event-publisher.service';
import { EventListener } from './rabbitmq/event.listener';

@Module({
  providers: [EmailService, EmailListener, EventPublisherService, EventListener ]
})
export class NotificationModule {}
