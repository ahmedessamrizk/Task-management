import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get<string>('BASE_URL'));

  //for handling cookies
  app.use(
    cookieSession({
      keys: [configService.get<string>('cookieSecret')],
    }),
  );

  //for handling validation
  app.useGlobalPipes(
    new ValidationPipe({
      //ignore unknown fields
      whitelist: true,
    }),
  );

  //for removing etag and x-powered-by headers
  (app as any).set('etag', false);
  app.use((req, res, next) => {
    res.removeHeader('x-powered-by');
    res.removeHeader('date');
    next();
  });
  
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
