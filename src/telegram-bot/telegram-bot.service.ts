import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { readFile } from 'fs';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';
import {
  generateUniqueRandomNumbers,
  getRandomIntFromInterval,
  replaceNonAlphanumeric,
} from 'src/shared/helpers/utility';
import {
  Anime,
  AnimeScreenshot,
  AnimeWithScreenshots,
} from 'src/shared/types/shikimori.model';
import { InputMediaPhoto } from 'telegraf/typings/core/types/typegram';
import { Context } from '../shared/types/context';

@Injectable()
export class TelegramBotService {
  private logger = new Logger('TelegramBotService');
  private baseShikiUrl = process.env.SHIKIMORI_BASE_URI;

  constructor(private httpService: HttpService) {}

  async handleRandomAnime(ctx: Context) {
    readFile(
      join(process.cwd(), 'anime-list.json'),
      'utf-8',
      async (err, data) => {
        if (err) {
          this.logger.error(err);
          ctx.reply('Error');
        } else {
          const animeRateList = JSON.parse(data) as Anime[];

          const randomNumberList = generateUniqueRandomNumbers(
            10,
            1,
            animeRateList.length,
          );

          const randomAnimeList = randomNumberList.map<AnimeWithScreenshots>(
            randomNumber => ({
              ...animeRateList[randomNumber - 1],
              screenshots: [],
            }),
          );

          for (let i = 0; i < randomAnimeList.length; i++) {
            const anime = randomAnimeList[i];
            try {
              const { data } = await this.getScreenshotByAnimeId(anime.id);
              randomAnimeList[i].screenshots = data;
            } catch (error) {
              this.logger.error(error);
            }
          }

          const randomAnimeMediaPhoto = randomAnimeList.map<InputMediaPhoto>(
            anime => {
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
            },
          );

          ctx.sendMediaGroup(randomAnimeMediaPhoto);
        }
      },
    );
  }

  private async getScreenshotByAnimeId(animeId: number) {
    return firstValueFrom(
      this.httpService.get<AnimeScreenshot[]>(
        `${this.baseShikiUrl}/api/animes/${animeId}/screenshots`,
        {
          headers: {
            'Accept-Encoding': 'gzip,deflate,compress',
          },
        },
      ),
    );
  }

  private getImageLink(imageOriginal: string) {
    return `${this.baseShikiUrl}${imageOriginal}`;
  }

  private getMediaPhotoCaption(anime: Anime) {
    return `||original: ${replaceNonAlphanumeric(
      anime.name,
    )}\nrussian: ${replaceNonAlphanumeric(anime.russian)}||`;
  }
}
