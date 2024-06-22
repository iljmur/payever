import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class RabbitMQService {
  constructor() {}

  @RabbitSubscribe({
    exchange: 'user_exchange',
    routingKey: 'user.created',
    queue: 'user_created_queue',
  })
  handleUserCreatedEvent(event: string, payload: any) {
    console.log(
      `${event} message is received by RabbitMQ: ${JSON.stringify(payload)}`,
    );
  }

  async publishUserCreatedEvent(event: string, payload: any) {
    this.handleUserCreatedEvent(event, payload);
  }
}
