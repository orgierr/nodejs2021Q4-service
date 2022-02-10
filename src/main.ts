import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './common/config';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/winston_config';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { ExpressAdapter } from '@nestjs/platform-express/adapters';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllInterceptor } from './interceptors/all.interceptor';
import { contentParser } from 'fastify-file-interceptor';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './common/swagger_config';

async function bootstrap() {
  const HttpAdapter = config.USE_FASTIFY ? FastifyAdapter : ExpressAdapter;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new HttpAdapter(),
  );
  app.useLogger(WinstonModule.createLogger(winstonConfig));
  const httpAdapterHost: HttpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, Logger));
  app.useGlobalInterceptors(new AllInterceptor(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  if (config.USE_FASTIFY) {
    app.register(contentParser);
  }

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/doc', app, document);

  await app.listen(config.PORT || 4000, config.ADDRESS);
}
bootstrap();
