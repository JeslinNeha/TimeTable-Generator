import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ClassTimeTableService } from './class-time-table.service';
import { Response } from 'express';
import { ClassTimeTable } from '@prisma/client';

@Controller('class-time-table')
export class ClassTimeTableController {
  constructor(private readonly classTimeTableService: ClassTimeTableService) {}

  @Get('/getAllClassTimeTable')
  async getAllClassTimeTable(@Res() res: Response) {
    try {
      const result = await this.classTimeTableService.getAllClassTimeTable();
      if (!result) {
        throw new NotFoundException();
      }
      return res.send(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(404)
          .send({ message: `Class time table does not exist for the selected class and section` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }

  @Get('/getClassTimeTable')
  async getClassInfo(
    @Query('class') selectedClass: string,
    @Query('section') selectedSection: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.classTimeTableService.getClassTimeTable(
        selectedClass,
        selectedSection,
      );
      return res.send(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(404)
          .send({ message: `Class time table does not exist for the selected class and section` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }

  @Post('/createClassTimeTableInfo')
  async createClassTimeTableInfo(
    @Body() classTimeTable: ClassTimeTable,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.classTimeTableService.createClassTimeTable(classTimeTable);
      return res.send(result);
    } catch (error) {
      if (error instanceof ConflictException) {
        return res
          .status(404)
          .send({ message: `Class time table already exists` });
      } else if (error instanceof BadRequestException) {
        return res.status(400).send({ message: 'Invalid request' });
      } else {
        res.status(500).send({ message: 'Please try again later' });
      }
    }
  }
}
