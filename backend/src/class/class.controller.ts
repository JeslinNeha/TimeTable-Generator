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
import { ClassService } from './class.service';
import { Response } from 'express';
import { Class } from '@prisma/client';
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('/getAllClasses')
  async getAllClasses(@Res() res: Response) {
    try {
      const result = await this.classService.getAllClasses();
      if (!result) {
        throw new NotFoundException();
      }
      return res.send(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).send({ message: `Class does not exist` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }

  @Get('/getClassInfo')
  async getClassInfo(
    @Query('class') selectedClass: string,
    @Query('section') selectedSection: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.classService.getClass(
        selectedClass,
        selectedSection,
      );
      if (!result) {
        throw new NotFoundException();
      }
      return res.send(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).send({ message: `Class does not exist` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }

  @Post('/createClassInfo')
  async createClassInfo(@Body() classInfo: Class, @Res() res: Response) {
    try {
      const result = await this.classService.createClass(classInfo);
      return res.send(result);
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(404).send({ message: `Class already exists` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }

  @Patch('/updateClassInfo')
  async updateClassInfo(
    @Body() classInfo: Partial<Class>,
    @Res() res: Response,
  ) {
    try {
      const result = await this.classService.updateClass(
        classInfo.id,
        classInfo,
      );
      return res.send(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).send({ message: `Class does not exist` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      }else if (error instanceof UnprocessableEntityException) {
        return res.status(400).send({ message: 'Cannot update the class' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }

  @Delete('/deleteClassInfo')
  async deleteClassInfo(@Query() id: string, @Res() res: Response) {
    try {
      const result = await this.classService.deleteClass(id);
      return res.send(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).send({ message: `Class does not exist` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else {
        res.status(500).send({ message: 'Please try again later'});
      }
    }
  }
}
