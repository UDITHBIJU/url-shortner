import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LinksService } from './links.service';
import { JwtAuthGuard } from '../auth/guards/jtw-auth.guard';
import { User } from 'src/auth/guards/decorators/user.decorator';
import { CreateLinkDto } from './dto/create-link.dto';
import { Body } from '@nestjs/common';
import { UpdateLinkDto } from './dto/update-link.dto';
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
  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateLink(
    @Body() updateLinkDto: UpdateLinkDto, // Assuming you have a DTO for updating links
    @User('userId') userId: string,
  ) {
    return this.linksService.updateLink(updateLinkDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async deleteLink(
    @Body('shortCode') shortCode: string,
    @User('userId') userId: string,
  ) {
    return this.linksService.deleteLink(shortCode, userId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  async getAllLinks(@User('userId') userId: string) {
    return this.linksService.listAllLinks(userId);
  }
}
