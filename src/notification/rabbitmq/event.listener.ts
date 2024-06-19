import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
//import { EventPublisherService } from './event-publisher.service';

@Injectable()
export class EventListener {
//   constructor(private readonly eventPublisherService: EventPublisherService) {}

//   @OnEvent('user.created')
//   async handleUserCreatedEvent(payload: { email: string }) {
//     await this.eventPublisherService.publishEvent('user.created', payload);
//   }
}