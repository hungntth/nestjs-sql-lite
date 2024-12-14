import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  formatDate(date: Date): string {
    return date.toISOString();
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
