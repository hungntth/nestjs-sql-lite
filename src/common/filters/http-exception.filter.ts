import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { I18nContext } from 'nestjs-i18n';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus();
      const i18n = I18nContext.current();
  
      let message = exception.message;
      
      // Translate error message if it's a translation key
      if (typeof message === 'string' && message.includes('.')) {
        message = i18n.t(message);
      }
  
      response.status(status).json({
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
      });
    }
  }