import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeacherModule } from './teacher/teacher.module';
import { ClassModule } from './class/class.module';
import { TeacherTimeTableModule } from './teacherTimeTable/teacher-time-table.module';
import { ClassTimeTableModule } from './classTimeTable/class-time-table.module';


@Module({
  imports: [TeacherModule, ClassModule,TeacherTimeTableModule, ClassTimeTableModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
