import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from '../links/entities/link.entity';
import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class RedirectService {
  constructor(
    @InjectRepository(Link) private readonly linkRepository: Repository<Link>,
  ) {}
  async redirectToLink(shortcode: string, res: Response) {
    const allData = await this.linkRepository.find();

    const link = await this.linkRepository.findOne({
      where: { shortCode: shortcode },
    });
    if (!link) {
      throw new NotFoundException('Link not found');
    }
    link.url = link.url.startsWith('http') ? link.url : `http://${link.url}`;
    return res.redirect(301, link.url);
  }
}
