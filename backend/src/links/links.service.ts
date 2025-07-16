import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './entities/link.entity';
import { CreateLinkDto } from './dto/create-link.dto';

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
}
