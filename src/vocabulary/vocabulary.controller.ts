import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { Vocabulary } from './schemas/vocabulary.schema';

@Controller('api/vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get()
  async findAll(): Promise<Vocabulary[]> {
    return this.vocabularyService.findAll();
  }

  @Post('import')
  async import() {
    return this.vocabularyService.import();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Vocabulary> {
    return this.vocabularyService.findOne(+id);
  }

  @Post()
  async create(@Body() createVocabularyDto: any): Promise<Vocabulary> {
    return this.vocabularyService.create(createVocabularyDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVocabularyDto: any,
  ): Promise<Vocabulary> {
    return this.vocabularyService.update(+id, updateVocabularyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.vocabularyService.remove(+id);
  }
}
