import {
  Body,
  Controller,
  Delete,
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
import { TeacherService } from './teacher.service';
import { Response } from 'express';
import { Teacher } from '@prisma/client';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('/getTeacherInfo')
  async getTeacherInfo(
    @Query('class') selectedClass: string,
    @Query('section') selectedSection: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.teacherService.getTeacher(
        selectedClass,
        selectedSection,
      );
      if (!result) {
        throw new NotFoundException();
      }
      return res.send(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).send({ message: `Teacher does not exist` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }

  @Get('/getSubjectTeachers')
  async getSubjectTeachers(@Res() res: Response) {
    try {
      const result = await this.teacherService.getSubjectTeachers();
      if (!result) {
        throw new NotFoundException();
      }
      return res.send(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).send({ message: `Teacher does not exist` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }

  @Get('/getAllTeachers')
  async getAllTeachers(@Res() res: Response) {
    try {
      const result = await this.teacherService.getAllTeachers();
      if (!result) {
        throw new NotFoundException();
      }
      return res.send(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).send({ message: `Teacher does not exist` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }

  @Post('/createTeacherInfo')
  async createTeacherInfo(@Body() teacher: Teacher, @Res() res: Response) {
    try {
      const result = await this.teacherService.createTeacher(teacher);
      return res.send(result);
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(404).send({ message: `Teacher already exists` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }

  @Patch('/updateTeacherInfo')
  async updateTeacherInfo(
    @Query('id') id: string,
    @Body() teacher: Partial<Teacher>,
    @Res() res: Response,
  ) {
    try {
      const result = await this.teacherService.updateTeacher(id, teacher);
      return res.send(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).send({ message: `Teacher does not exist` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else if (error instanceof UnprocessableEntityException) {
        return res.status(400).send({ message: 'Cannot update the teacher' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }

  @Delete('/deleteTeacherInfo')
  async deleteTeacherInfo(@Query('id') id: string, @Res() res: Response) {
    try {
      const result = await this.teacherService.deleteTeacher(id);
      return res.send(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).send({ message: `Teacher does not exist` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }
}
