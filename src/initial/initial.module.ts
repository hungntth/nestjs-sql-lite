import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { InitService } from './initial.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Import User entity to interact with DB
  providers: [InitService], // Register InitService
})
export class InitModule {}
