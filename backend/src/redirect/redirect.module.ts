import { Module } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { RedirectController } from './redirect.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from 'src/links/entities/link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Link])], // Add any entities if needed
  controllers: [RedirectController],
  providers: [RedirectService],
})
export class RedirectModule {}
