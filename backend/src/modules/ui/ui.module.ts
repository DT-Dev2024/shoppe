import { Module } from '@nestjs/common';
import { UiService } from './ui.service';
import { UiController } from './ui.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [UiController],
  providers: [UiService],
  imports: [PrismaModule,SharedModule],
})
export class UiModule {}
