import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UploadModule } from './upload/upload.module';
import { TranslationModule } from './i18n/i18n.module';
import jwtConfig from './common/config/jwt.config';
import initConfig from './common/config/init.config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CategoriesModule } from './categories/categories.module';
import { InitModule } from './initial/initial.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, initConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/images'),
      serveRoot: '/images',
    }),
    TranslationModule,
    UsersModule,
    AuthModule,
    CommonModule,
    UploadModule,
    CategoriesModule,
    InitModule,
  ],
})
export class AppModule {}
