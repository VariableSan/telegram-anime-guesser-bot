import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('update-anime-list')
  updateAnimeList(@Res() response: Response) {
    this.appService.updateAnimeList().subscribe({
      next: () => {
        response.sendStatus(HttpStatus.OK);
      },
      error: err => {
        response.status(HttpStatus.NOT_FOUND).send(err);
      },
    });
  }
}
