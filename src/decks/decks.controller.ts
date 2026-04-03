import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { DecksService } from './decks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('decks')
@UseGuards(JwtAuthGuard)
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  create(@Request() req: any, @Body() body: any) {
    const { name, description } = body;
    return this.decksService.create(req.user.id, name, description);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.decksService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.decksService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateDeckDto: any) {
    return this.decksService.update(id, req.user.id, updateDeckDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.decksService.remove(id, req.user.id);
  }
}
