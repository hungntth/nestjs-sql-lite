import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { I18nService } from 'nestjs-i18n';
import { I18nValidationPipe } from './common/pipes/i18n-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const i18nService:any = app.get(I18nService);

  // Global validation pipe with i18n support
  app.useGlobalPipes(new I18nValidationPipe(i18nService));

  // Global exception filter for i18n error messages
  // app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptor for response transformation
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
