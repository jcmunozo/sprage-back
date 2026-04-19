import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Link, LinkSchema } from './schemas/link.schema';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { LanguagesModule } from '../languages/languages.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
    LanguagesModule,
  ],
  controllers: [LinksController],
  providers: [LinksService],
  exports: [LinksService],
})
export class LinksModule {}
