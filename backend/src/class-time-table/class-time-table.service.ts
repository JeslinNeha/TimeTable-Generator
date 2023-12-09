import { Injectable } from '@nestjs/common';
import { ClassTimeTable} from '@prisma/client';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class ClassTimeTableService {
    constructor(private prisma: PrismaService) {}

    async getAllClassTimeTable() :Promise<ClassTimeTable[]> {
        return await this.prisma.classTimeTable.findMany()
    }

    async getClassTimeTable(selectedClass:string,selectedSection:string)
    {
      return await this.prisma.classTimeTable.findFirst({where:{class:selectedClass,section:selectedSection}});
    }

    async createClassTimeTable(classTimeTableData:ClassTimeTable)  {
        return await this.prisma.classTimeTable.create({data:classTimeTableData});
      }

      
}
