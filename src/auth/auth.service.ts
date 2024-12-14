import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private logger: LoggerService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(1); // Modified for demo
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }

  async login(user: any) {
    this.logger.log(`User logged in: ${user.email}`);
    return {
      access_token: 'jwt_token_would_go_here',
      user,
    };
  }
}