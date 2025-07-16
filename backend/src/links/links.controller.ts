import { Controller, Post, UseGuards } from '@nestjs/common';
import { LinksService } from './links.service';
import { JwtAuthGuard } from '../auth/guards/jtw-auth.guard'; // Import the JWT Auth Guard
import { User } from 'src/auth/guards/decorators/user.decorator';
import { CreateLinkDto } from './dto/create-link.dto'; // Assuming you have a DTO for creating links
import { Body } from '@nestjs/common'; // Import Body for handling request bodies

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createLink(
    @Body() createLinkDto: CreateLinkDto,
    @User('userId') userId: string,
  ) {
    return this.linksService.createLink(createLinkDto, userId);
  }
}
