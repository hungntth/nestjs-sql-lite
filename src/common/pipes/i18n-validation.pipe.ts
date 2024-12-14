import { BadRequestException, Injectable, ValidationError, ValidationPipe } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class I18nValidationPipe extends ValidationPipe {
  constructor(private readonly i18n: I18nService) {
    super({
      exceptionFactory: async (errors: ValidationError[]) => {
        const messages = await Promise.all(
          errors.map(async (error) => {
            const constraints = error.constraints;
            const translatedMessages = {};

            for (const key in constraints) {
              if (constraints[key]) {
                // Dịch thông báo lỗi
                translatedMessages[key] = await this.i18n.translate(
                  constraints[key],
                  {
                    lang: 'vi', // Hoặc lấy từ header, cookie, query param, v.v.
                  },
                );
              }
            }

            return translatedMessages;
          }),
        );

        // Trả về lỗi với thông báo đã được dịch
        throw new BadRequestException(messages);
      },
    });
  }
}
