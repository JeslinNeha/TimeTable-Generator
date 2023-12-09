import { Module } from '@nestjs/common';
import { ClassTimeTableController } from './class-time-table.controller';
import { ClassTimeTableService } from './class-time-table.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ClassTimeTableController],
  providers: [ClassTimeTableService,PrismaService]
})
export class ClassTimeTableModule {}
