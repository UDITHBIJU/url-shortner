import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from '../links/entities/link.entity';
import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import Redis from 'ioredis';

@Injectable()
export class RedirectService {
  constructor(
    @InjectRepository(Link) private readonly linkRepository: Repository<Link>,
    @Inject('REDIS_CLIENT') private readonly cache: Redis, // Inject Redis client if needed
  ) {}

  async redirectToLink(shortcode: string, res: Response) {
    // Check if the link is cached
    const cachedLink = await this.cache.get(shortcode);
    if (cachedLink) {
      console.log(`Redirecting to cached link: ${cachedLink}`);
      return res.redirect(301, cachedLink);
    }

    const link = await this.linkRepository.findOne({
      where: { shortCode: shortcode },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }
    await this.cache.set(shortcode, link.url, 'EX', 21600); // Cache for 6 hours

    return res.redirect(301, link.url);
  }
}
 