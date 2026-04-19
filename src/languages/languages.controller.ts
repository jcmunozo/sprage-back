import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('languages')
@UseGuards(JwtAuthGuard)
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  create(@Request() req: any, @Body() body: any) {
    const { name, code } = body;
    return this.languagesService.create(req.user.id, name, code);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.languagesService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.languagesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.languagesService.update(id, req.user.id, body);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.languagesService.remove(id, req.user.id);
  }
}
