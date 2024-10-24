import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
  controllers: [WalletController],
  providers: [WalletService,TransactionService],
})
export class WalletModule {}
