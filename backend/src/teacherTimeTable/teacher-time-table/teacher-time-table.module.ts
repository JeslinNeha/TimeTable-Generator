import { Module } from '@nestjs/common';
import { TeacherTimeTableService } from './teacher-time-table.service';
import { PrismaService } from 'src/prisma.service';
import { TeacherTimeTableController } from './teacher-time-table.controller';

@Module({
  controllers:[TeacherTimeTableController],
  providers: [TeacherTimeTableService,PrismaService]
})
export class TeacherTimeTableModule {

}
