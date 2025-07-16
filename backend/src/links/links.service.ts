import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './entities/link.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThan, IsNull, Not } from 'typeorm';
import { UpdateLinkDto } from './dto/update-link.dto';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link) private readonly linkRepository: Repository<Link>,
  ) {}

  async createLink(createLinkDto: CreateLinkDto, userId: string) {
    const { url, expiresAt } = createLinkDto;
   
    const existingLink = await this.linkRepository.findOne({
      where: { url, userId },
    });

    if (existingLink) {
      return {
        url: existingLink.url,
        shortcode: existingLink.shortCode,
        expiresAt: existingLink.expiresAt,
      };
    }
    const shortcode = await this.generateShortcode(url);
    const link = this.linkRepository.create({
      url,
      shortCode: shortcode,
      expiresAt,
      userId,
    });
    
    await this.linkRepository.save(link);
    return {
      url: link.url,
      shortcode: link.shortCode,
      expiresAt: link.expiresAt,
    };
  }

async updateLink(updateLinkDto: UpdateLinkDto, userId: string) {
    const { url, expiresAt,shortCode} = updateLinkDto;
    const existingLink = await this.linkRepository.findOne({
      where: { shortCode, userId },
    });

    if (!existingLink) {
      throw new Error('Link not found');
    }

    existingLink.url = url;
    existingLink.expiresAt = expiresAt;
    await this.linkRepository.save(existingLink);
    return {
      url: existingLink.url,
      shortcode: existingLink.shortCode,
      expiresAt: existingLink.expiresAt,
    };
  }

  async deleteLink(shortCode: string, userId: string) {
    const link = await this.linkRepository.findOne({
      where: { shortCode, userId },
    });
    if (!link) {
      throw new Error('Link not found');
    }
    await this.linkRepository.remove(link);
    return { message: 'Link deleted successfully' };
  }
async listAllLinks(userId: string) {
    const links = await this.linkRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return links.map((link) => ({
      url: link.url,
      shortCode: link.shortCode,
      expiresAt: link.expiresAt,
      createdAt: link.createdAt,
    }));
  }
  private async generateShortcode(url: string): Promise<string> {
    let attempts = 0;
    const maxAttempts = 5;
    do {
      const base62 =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let shortcode = '';
      for (let i = 0; i < 6; i++) {
        shortcode += base62.charAt(Math.floor(Math.random() * base62.length));
      }
      const existingLink = await this.linkRepository.findOne({
        where: { shortCode: shortcode },
      });
      if (!existingLink) {
        return shortcode;
      }
    } while (attempts < maxAttempts);
    throw new Error(
      'Failed to generate unique shortcode after multiple attempts',
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredLinks() {
    const currentDate = new Date();
    await this.linkRepository.delete({
      expiresAt: Not(IsNull()) && LessThan(currentDate),
    });
    console.log('Expired links deleted successfully');
  }
}
