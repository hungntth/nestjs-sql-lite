import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { CryptoService } from 'src/common/services/crypto.service';

@Injectable()
export class InitService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private cryptoService: CryptoService,
  ) {}

  async onModuleInit() {
    await this.createOrUpdateUser();
  }

  private async createOrUpdateUser() {
    const email = this.configService.get<string>('USER_EMAIL');
    const firstName = this.configService.get<string>('USER_FIRST_NAME');
    const lastName = this.configService.get<string>('USER_LAST_NAME');
    const roles = this.configService.get<string>('USER_ROLES').split(',');

    let user = await this.userRepository.findOne({ where: { email } });
    const randomPassword = crypto.randomBytes(16).toString('hex');
    const hashedPassword =
      await this.cryptoService.hashPassword(randomPassword);

    if (user) {
      user.password = hashedPassword;
      await this.userRepository.save(user);
      console.log('Updated password:', randomPassword);
    } else {
      user = this.userRepository.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        roles,
      });
      await this.userRepository.save(user);
      console.log('Created new user with password:', randomPassword);
    }
  }
}
