import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { I18nContext } from 'nestjs-i18n';
  
  @Injectable()
  export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map(data => {
          const i18n = I18nContext.current();
          
          // If the response is an error message, translate it
          if (typeof data === 'string' && data.includes('.')) {
            return {
              data: i18n.t(data),
              statusCode: context.switchToHttp().getResponse().statusCode,
            };
          }
  
          // For regular responses
          return {
            data,
            statusCode: context.switchToHttp().getResponse().statusCode,
          };
        }),
      );
    }
  }