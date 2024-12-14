import { BadRequestException, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Upload } from './entities/upload.entity';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { I18nService } from 'nestjs-i18n';

@Module({
  imports: [
    TypeOrmModule.forFeature([Upload]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (i18n: I18nService) => ({
        storage: diskStorage({
          destination: './uploads/images',
          filename: (req, file, callback) => {
            const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
            callback(null, uniqueName);
          },
        }),
        fileFilter: async (req, file, callback) => {
          const invalidFileMessage = await i18n.translate(
            'upload.INVALID_TYPE',
            {
              lang: req.headers['accept-language'] || 'vi',
            },
          );

          if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return callback(new BadRequestException(invalidFileMessage), false); // Lỗi 400 khi file không hợp lệ
          }
          callback(null, true);
        },
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB
        },
      }),
      inject: [I18nService],
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
