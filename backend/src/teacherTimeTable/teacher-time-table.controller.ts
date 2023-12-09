import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Res,
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TeacherTimeTableService } from './teacher-time-table.service';
import { Response } from 'express';
import { TeacherTimeTable } from '@prisma/client';

@Controller('teacher-time-table')
export class TeacherTimeTableController {
  constructor(
    private readonly teacherTimeTableService: TeacherTimeTableService,
  ) {}

  @Get('/getAllTeachersTimeTable')
  async getAllTeachersTimeTable(@Res() res: Response) {
    try {
      const result =
        await this.teacherTimeTableService.getAllTeachersTimeTable();
      if (!result) {
        throw new NotFoundException();
      }
      return res.send(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(404)
          .send({ message: `Teacher time table does not exist for the selected teacher` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }

  @Get('/getTeacherTimeTable')
  async getClassInfo(
    @Query('teacherName') teacherName: string,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.teacherTimeTableService.getTeacherTimeTable(teacherName);
      if (!result) {
        throw new NotFoundException();
      }
      return res.send(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(404)
          .send({ message: `Teacher time table does not exist for the selected teacher` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }

  @Get('/getTeachersTimeTableByName')
  async getTeachersTimeTableByName(
    @Res() res: Response,
    @Query('teacherName') teacherName: string[],
  ) {
    try {
      if (!teacherName || teacherName.length === 0) {
        throw new BadRequestException();
      }

      const result =
        await this.teacherTimeTableService.getTeachersTimeTableByNames(
          teacherName,
        );
      if (!result) {
        throw new NotFoundException();
      }
      return res.send(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(404)
          .send({ message: `Teacher time table data does not exist for the selected teacher` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }

  @Post('/createTeacherTimeTableInfo')
  async createTeacherTimeTableInfo(
    @Body() teacherTimeTable: TeacherTimeTable,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.teacherTimeTableService.createTeacherTimeTable(
          teacherTimeTable,
        );
      return res.send(result);
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(404).send({ message: `Teacher time table already exists` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }

  @Patch('/updateTeacherTimeTableInfo')
  async updateTeacherTimeTableInfo(
    @Body() teacherTimeTable: TeacherTimeTable[],
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.teacherTimeTableService.updateTeacherTimeTable(
          teacherTimeTable,
        );
      return res.send(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).send({ message: `Teacher time table data does not exist for the selected teacher` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      }else if (error instanceof UnprocessableEntityException) {
        return res.status(400).send({ message: 'Cannot update the teacher time table' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }
}
