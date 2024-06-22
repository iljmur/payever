import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RabbitMQService } from './rabbitmq.service';

@Injectable()
export class EventListener {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @OnEvent('user.registered.send.message')
  async handleUserCreatedEvent(payload: { email: string }) {
    await this.rabbitMQService.publishUserCreatedEvent('user.created', payload);
  }
}
