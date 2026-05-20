import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Link, LinkSchema } from './schemas/link.schema';
import { Language, LanguageSchema } from '../languages/schemas/language.schema';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Link.name, schema: LinkSchema },
      { name: Language.name, schema: LanguageSchema },
    ]),
  ],
  controllers: [LinksController],
  providers: [LinksService],
  exports: [LinksService],
})
export class LinksModule {}
