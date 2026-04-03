import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Request() req: any, @Body() createCardDto: any) {
    return this.cardsService.create(req.user.id, createCardDto);
  }

  @Post('import')
  import(@Request() req: any) {
    return this.cardsService.importUnifiedData(req.user.id);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.cardsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.cardsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateCardDto: any) {
    return this.cardsService.update(id, req.user.id, updateCardDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.cardsService.remove(id, req.user.id);
  }
}
