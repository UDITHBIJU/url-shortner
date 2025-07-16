import { Controller, Get, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { RedirectService } from './redirect.service';

@Controller()
export class RedirectController {
  constructor(private readonly RedirectService: RedirectService) {}

  @Get(':shortcode')
  async redirectToLink(
    @Param('shortcode') shortcode: string,
    @Res() res: Response,
  ) {
    this.RedirectService.redirectToLink(shortcode, res);
  }
}
