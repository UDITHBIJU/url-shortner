import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule to use guards and

@Module({
  imports: [
    TypeOrmModule.forFeature([Link]), 
    AuthModule, 
  ],
  controllers: [LinksController],
  providers: [LinksService],
  exports: [LinksService],
})
export class LinksModule {}
