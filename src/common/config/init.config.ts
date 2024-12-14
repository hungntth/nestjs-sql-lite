import { registerAs } from '@nestjs/config';

export default registerAs('init', () => ({
  USER_EMAIL: process.env.USER_EMAIL || 'hungnt@gmail.com',
  USER_FIRST_NAME: process.env.USER_FIRST_NAME || 'Nguyen',
  USER_LAST_NAME: process.env.USER_LAST_NAME || 'Thai Hung',
  USER_ROLES: process.env.USER_ROLES || 'user,admin',
}));
