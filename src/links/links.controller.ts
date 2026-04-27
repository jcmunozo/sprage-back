import { Controller, Get, Post, Patch, Body, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { LinksService } from './links.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('links')
@UseGuards(JwtAuthGuard)
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  create(@Request() req: any, @Body() createLinkDto: any) {
    return this.linksService.create(req.user.id, createLinkDto);
  }

  @Get()
  findAll(@Request() req: any, @Query('languageId') languageId?: string) {
    if (languageId) {
      return this.linksService.findByLanguage(req.user.id, languageId);
    }
    return this.linksService.findAllByUser(req.user.id);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateLinkDto: any) {
    return this.linksService.update(id, req.user.id, updateLinkDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.linksService.remove(id, req.user.id);
  }
}
