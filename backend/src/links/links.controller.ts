import { Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
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
  @Put('update/:id')
  async updateLink(
    @Param('id') id: string,
    @Body() updateLinkDto: UpdateLinkDto, 
    @User('userId') userId: string,
  ) {
    return this.linksService.updateLink(updateLinkDto,userId,id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteLink(
   @Param('id') id: string, 
    @User('userId') userId: string,
  ) {
    return this.linksService.deleteLink(id, userId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  async getAllLinks(@User('userId') userId: string) {
    return this.linksService.listAllLinks(userId);
  }
}
