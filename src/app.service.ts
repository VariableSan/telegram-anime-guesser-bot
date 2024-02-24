import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { map } from 'rxjs';
import {
  LegacyAnimesParams,
  UserAnimeRate,
} from './shared/types/shikimori.model';

@Injectable()
export class AppService {
  private logger = new Logger('AppService');

  constructor(private httpService: HttpService) {}

  updateAnimeList() {
    const baseShikiUrl = process.env.SHIKIMORI_BASE_URI;
    const username = process.env.SHIKIMORI_USERNAME;

    const params: Partial<LegacyAnimesParams> = {
      page: 1,
      limit: 1000,
    };

    return this.httpService
      .get<UserAnimeRate[]>(
        `${baseShikiUrl}/api/users/${username}/anime_rates`,
        {
          params,
          headers: {
            'Accept-Encoding': 'gzip,deflate,compress',
          },
        },
      )
      .pipe(
        map(async res => {
          const { data } = res;
          const convertedData = data.map(el => el.anime);

          try {
            await writeFile(
              join(process.cwd(), 'anime-list.json'),
              JSON.stringify(convertedData),
            );

            return res;
          } catch (error) {
            throw new Error(error);
          }
        }),
      );
  }
}
