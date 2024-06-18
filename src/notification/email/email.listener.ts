// src/notification/email.listener.ts

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from './email.service';

@Injectable()
export class EmailListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent('user.registered.send.email')
  handleUserRegisteredEvent(payload: { email: string }) {
    const { email } = payload
    this.emailService.sendEmail(email, 'Welcome to Our App', 'Thank you for registering!')
  }
}