import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'payever test assignment. Please proceed with rest client to test documented api endpoints.';
  }
}
