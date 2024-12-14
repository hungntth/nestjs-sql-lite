import { Module, Global } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { UtilsService } from './services/utils.service';
import { CryptoService } from './services/crypto.service';

@Global()
@Module({
  providers: [LoggerService, UtilsService, CryptoService],
  exports: [LoggerService, UtilsService, CryptoService],
})
export class CommonModule {}