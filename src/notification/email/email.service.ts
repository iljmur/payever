// src/notification/email.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    // Use a dummy SMTP server for testing (like Mailtrap, Ethereal, etc.)
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'your-ethereal-username', // replace with your ethereal username
      pass: 'your-ethereal-password', // replace with your ethereal password
    },
  })

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'no-reply@yourapp.com',
      to,
      subject,
      text,
    }

    try {
      const info = await this.transporter.sendMail(mailOptions)
      console.log('Email sent: ' + info.response)
    } catch (error) {
      console.error('Error sending email: ', error)
    }
  }
}