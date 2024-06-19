import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from './notification/notification.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot( process.env.DB_URI ),
    UserModule,
    EventEmitterModule.forRoot(),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'exchange1',
          type: 'topic',
        },
      ],
      uri: 'amqps://jgtaogkf:Kc29J0w-r6M6btXE11wx9aUj8JQEzRDu@hawk.rmq.cloudamqp.com/jgtaogkf',
    }),
    NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
