export type RateType = 'manga' | 'anime';

export interface AbstractUserRate {
  id: number;
  score: number;
  status: AnimeStatus;
  text: string;
  episodes: number;
  chapters: number;
  volumes: number;
  text_html: string;
  rewatches: number;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface UserAnimeRate extends AbstractUserRate {
  anime: Anime;
  manga: null;
}

export interface LegacyAnime {
  id: number;
  name: string;
  russian: string;
  image: AnimeImage;
  url: string;
  kind: string;
  score: string;
  status: string;
  episodes: number;
  episodes_aired: number;
  aired_on: string;
  released_on: string;
}

export interface Anime {
  id: number;
  name: string;
  russian: string;
  image: AnimeImage;
  url: string;
  kind: string;
  score: string;
  status: string;
  episodes: number;
  episodes_aired: number;
  aired_on: string;
  released_on: string;
}

export interface AnimeImage {
  original: string;
  preview: string;
  x96: string;
  x48: string;
}

export interface User {
  id: number;
  nickname: string;
  avatar: string;
  image: UserImage;
  last_online_at: string;
  url: string;
}

export interface UserImage {
  x160: string;
  x148: string;
  x80: string;
  x64: string;
  x48: string;
  x32: string;
  x16: string;
}

export interface DefaultQueryParams {
  limit: number;
  page: number;
  target_type: 'Anime' | 'Manga';
  status: AnimeStatus;
}

export enum AnimeStatus {
  PLANNED = 'planned',
  WATCHING = 'watching',
  REWATCHING = 'rewatching',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  DROPPED = 'dropped',
}

export interface UserMangaRate extends AbstractUserRate {
  anime: null;
  manga: Manga;
}

export interface Manga {
  id: number;
  name: string;
  russian: string;
  image: MangaImage;
  url: string;
  kind: string;
  score: string;
  status: string;
  volumes: number;
  chapters: number;
  aired_on: null;
  released_on: null;
}

export interface MangaImage {
  original: string;
  preview: string;
  x96: string;
  x48: string;
}

export type UserRate = UserAnimeRate | UserMangaRate;

type LegacyAnimeDuration = 'S' | 'D' | 'F';

type LegacyAnimeStatus = 'anons' | 'ongoing' | 'released';

type LegacyAnimeRating = 'none' | 'g' | 'pg' | 'pg_13' | 'r' | 'r_plus' | 'rx';

type LegacyAnimeKind =
  | 'tv'
  | 'movie'
  | 'ova'
  | 'ona'
  | 'special'
  | 'music'
  | 'tv_13'
  | 'tv_24'
  | 'tv_48';

type LegacyAnimeOrder =
  | 'id'
  | 'id_desc'
  | 'ranked'
  | 'kind'
  | 'popularity'
  | 'name'
  | 'aired_on'
  | 'episodes'
  | 'status'
  | 'random'
  | 'created_at'
  | 'created_at_desc';

type LegacyUserRateStatus =
  | 'planned'
  | 'watching'
  | 'completed'
  | 'rewatching'
  | 'on_hold'
  | 'dropped';

export interface LegacyAnimesParams {
  page: number;
  limit: number;
  order: LegacyAnimeOrder;
  kind: LegacyAnimeKind;
  status: LegacyAnimeStatus;
  season: string;
  score: number;
  duration: LegacyAnimeDuration;
  rating: LegacyAnimeRating;
  genre: string;
  studio: string;
  franchise: string;
  censored: boolean;
  mylist: LegacyUserRateStatus;
  ids: string;
  exclude_ids: string;
  search: string;
}

export interface AnimeScreenshot {
  original: string;
  preview: string;
}

export type AnimeWithScreenshots = Anime & { screenshots: AnimeScreenshot[] };
