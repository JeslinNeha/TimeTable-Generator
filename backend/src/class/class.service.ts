import { Injectable } from '@nestjs/common';
import { Prisma, Class } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ClassService {
    constructor(private prisma: PrismaService) {}

    async getClass(selectedClass:string,selectedSection:string)
    {
      return await this.prisma.class.findFirst({where:{class:selectedClass,section:selectedSection}});
    }


    async getAllClasses() :Promise<Class[]> {
        return await this.prisma.class.findMany()
      }

    async createClass(classData:Class)  {
        return await this.prisma.class.create({data:classData});
      }

    async updateClass(classId:string,classData:Partial<Class>)  {
        return await this.prisma.class.update({where:{id:classId},data:classData});
      }

    async deleteClass(classId:string)  {
        return await this.prisma.class.delete({where:{id:classId}});
      }
}
