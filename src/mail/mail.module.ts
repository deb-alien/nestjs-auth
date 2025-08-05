import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResendModule } from 'nestjs-resend';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    ResendModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        apiKey: config.get('RESEND_API_KEY') as string,
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
