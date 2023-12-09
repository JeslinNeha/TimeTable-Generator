import { Injectable } from '@nestjs/common';
import { Prisma, TeacherTimeTable } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TeacherTimeTableService {
  constructor(private prisma: PrismaService) {}
  async getAllTeachersTimeTable(): Promise<TeacherTimeTable[]> {
    return await this.prisma.teacherTimeTable.findMany();
  }

  async getTeachersTimeTableByNames(teacherNames: string[]) {
    return this.prisma.teacherTimeTable.findMany({
      where: { teacherName: { in: teacherNames } },
    });
  }

  async getTeacherTimeTable(teacherName: string) {
    return await this.prisma.teacherTimeTable.findFirst({
      where: { teacherName: teacherName },
    });
  }

  async createTeacherTimeTable(teacherTimeTableData: TeacherTimeTable) {
    return await this.prisma.teacherTimeTable.create({
      data: teacherTimeTableData,
    });
  }

  async updateTeacherTimeTable(teacherTimeTableData: TeacherTimeTable[]) {
    teacherTimeTableData.map(async (data) => {
      const { id, teacherScheduleInfo } = data;
      return await this.prisma.teacherTimeTable.updateMany({
        where: {
          id: id, 
        },
        data: {
          teacherScheduleInfo: {
            set: teacherScheduleInfo, 
          },
        },
      });
    });
  }
}
