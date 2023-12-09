import { Injectable } from '@nestjs/common';
import { Prisma, Teacher } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TeacherService {
    constructor(private prisma: PrismaService) {}

    async getTeacher(selectedClass:string,selectedSection:string)
    {
      return await this.prisma.teacher.findFirst({where:{class:selectedClass,section:selectedSection}});
    }

    async getSubjectTeachers(): Promise<{id:string,name:string}[]> {

    return await this.prisma.teacher.findMany({ select: { id: true, name: true } });
    }

    async getAllTeachers() :Promise<Teacher[]> {
        return await this.prisma.teacher.findMany()
      }

    async createTeacher(teacherData:Teacher)  {
        return await this.prisma.teacher.create({data:teacherData});
      }

    async updateTeacher(teacherId:string,teacherData:Partial<Teacher>)  {
        return await this.prisma.teacher.update({where:{id:teacherId},data:teacherData});
      }

    async deleteTeacher(teacherId:string)  {
        return await this.prisma.teacher.delete({where:{id:teacherId}});
      }
}
