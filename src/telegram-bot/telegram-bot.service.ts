import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { promises } from 'fs';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';
import { Context } from 'telegraf';
import { InputMediaPhoto } from 'telegraf/typings/core/types/typegram';
import {
  generateUniqueRandomNumbers,
  getRandomIntFromInterval,
  replaceNonAlphanumeric,
} from '../shared/helpers/utility';
import {
  Anime,
  AnimeScreenshot,
  AnimeWithScreenshots,
  LegacyAnimesParams,
} from '../shared/types/shikimori.model';

@Injectable()
export class TelegramBotService {
  private readonly logger = new Logger(TelegramBotService.name);

  private activeRequests = 0;
  private maxConcurrentRequests =
    Number(process.env.MAX_CONCURRENT_REQUESTS) || 3;
  private baseShikiUrl = process.env.SHIKIMORI_BASE_URI;

  constructor(private readonly httpService: HttpService) {}

  async sendRandomAuthorList(ctx: Context) {
    if (!(await this.checkRequestLimit(ctx))) return;

    try {
      const animeList = await this.readAnimeList();
      const randomAnimeList = await this.getRandomAnimeWithScreenshots(
        animeList,
        10,
      );
      const mediaPhotos = this.createMediaPhotos(randomAnimeList);
      await ctx.sendMediaGroup(mediaPhotos);
    } catch (error) {
      this.logger.error('Failed to send author list:', error);
      await ctx.reply('Произошла ошибка при обработке запроса');
    } finally {
      this.activeRequests--;
    }
  }

  async sendRandomShikimoriList(ctx: Context) {
    if (!(await this.checkRequestLimit(ctx))) return;

    try {
      const { data: animeList } = await this.fetchShikimoriAnimeList({
        limit: 10,
        order: 'random',
        kind: 'tv',
        status: 'released',
      });
      const randomAnimeList = await this.getRandomAnimeWithScreenshots(
        animeList,
        10,
      );
      const mediaPhotos = this.createMediaPhotos(randomAnimeList);
      await ctx.sendMediaGroup(mediaPhotos);
    } catch (error) {
      this.logger.error('Failed to send shikimori list:', error);
      await ctx.reply('Произошла ошибка при обработке запроса');
    } finally {
      this.activeRequests--;
    }
  }

  private async checkRequestLimit(ctx: Context): Promise<boolean> {
    if (this.activeRequests >= this.maxConcurrentRequests) {
      await ctx.reply('Бот сейчас занят. Пожалуйста, попробуйте позже.');
      return false;
    }
    this.activeRequests++;
    return true;
  }

  private async readAnimeList(): Promise<Anime[]> {
    try {
      const data = await promises.readFile(
        join(process.cwd(), 'anime-list.json'),
        'utf-8',
      );
      return JSON.parse(data) as Anime[];
    } catch (error) {
      this.logger.error('Failed to read anime list:', error);
      throw new Error('Failed to read anime list');
    }
  }

  private async getRandomAnimeWithScreenshots(
    animeList: Anime[],
    count: number,
  ): Promise<AnimeWithScreenshots[]> {
    const randomNumbers = generateUniqueRandomNumbers(
      count,
      1,
      animeList.length,
    );
    const randomAnimeList = randomNumbers.map<AnimeWithScreenshots>(num => ({
      ...animeList[num - 1],
      screenshots: [],
    }));

    await Promise.all(
      randomAnimeList.map(async anime => {
        try {
          const { data } = await this.getScreenshotByAnimeId(anime.id);
          anime.screenshots = data;
        } catch (error) {
          this.logger.error(
            `Failed to get screenshots for anime ID ${anime.id}:`,
            error,
          );
        }
      }),
    );

    return randomAnimeList;
  }

  private createMediaPhotos(
    animeList: AnimeWithScreenshots[],
  ): InputMediaPhoto[] {
    return animeList.map(anime => {
      const randomScreenshot =
        anime.screenshots[
          getRandomIntFromInterval(1, anime.screenshots.length)
        ];

      return {
        type: 'photo',
        media: this.getImageLink(
          randomScreenshot?.original ?? anime.image.original,
        ),
        caption: this.getMediaPhotoCaption(anime),
        parse_mode: 'MarkdownV2',
      };
    });
  }

  private async getScreenshotByAnimeId(animeId: number) {
    try {
      return await firstValueFrom(
        this.httpService.get<AnimeScreenshot[]>(
          `${this.baseShikiUrl}/api/animes/${animeId}/screenshots`,
          {
            headers: {
              'Accept-Encoding': 'gzip,deflate,compress',
            },
          },
        ),
      );
    } catch (error) {
      this.logger.error(
        `Failed to fetch screenshots for anime ID ${animeId}:`,
        error,
      );
      throw error;
    }
  }

  private getImageLink(imageOriginal: string) {
    return `${this.baseShikiUrl}${imageOriginal}`;
  }

  private getMediaPhotoCaption(anime: Anime) {
    return `||original: ${replaceNonAlphanumeric(
      anime.name,
    )}\nrussian: ${replaceNonAlphanumeric(anime.russian)}||`;
  }

  private fetchShikimoriAnimeList(params?: Partial<LegacyAnimesParams>) {
    return firstValueFrom(
      this.httpService.get<Anime[]>(`${this.baseShikiUrl}/api/animes`, {
        params,
      }),
    );
  }
}
