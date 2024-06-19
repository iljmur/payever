// src/notification/rabbitmq/event-publisher.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class EventPublisherService {

  async publishEvent(event: string, payload: any) {
    console.log(`Published event: ${event} with payload: ${JSON.stringify(payload)}`);
  }
}
