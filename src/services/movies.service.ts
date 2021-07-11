import { Movie, Torrent } from '../models/yify';
import { MetadataSearchable, PlexConfig, PlexResponse } from '../models/plex';
import { BtcConfig, BtcMainData } from '../models';

const movieApiBaseUrl = 'https://yts.mx/api/v2/';
const plexConfig: PlexConfig = {
  address: process.env.REACT_APP_PLEX_ADDRESS,
  port: process.env.REACT_APP_PLEX_PORT,
  token: process.env.REACT_APP_PLEX_TOKEN,
  section: process.env.REACT_APP_PLEX_SECTION,
  sectionType: process.env.REACT_APP_PLEX_SECTION_TYPE,
  sectionId: '',
};
const btcConfig: BtcConfig = {
  address: process.env.REACT_APP_BTC_ADDRESS,
  port: process.env.REACT_APP_BTC_PORT,
  category: process.env.REACT_APP_BTC_CATEGORY,
};

const btcOptions: RequestInit = {
  mode: 'no-cors',
  cache: 'no-cache',
  keepalive: true,
  credentials: 'include',
  redirect: 'follow',
  headers: {
    Accept: '*/*',
    'User-Agent': 'MovieService/0.0.1',
    'Accept-Encoding': 'gzip, deflate, br',
    Referer: `http://${btcConfig.address}:${btcConfig.port}`,
    Origin: `http://${btcConfig.address}:${btcConfig.port}`,
  },
};

let btcDataCache: BtcMainData | undefined = undefined;

export async function findMovieTorrent(hash?: string, cache: boolean = true) {
  if (!hash) return undefined;
  const lowerHash = hash.toLowerCase();

  const btcData = await getBtcData(cache);
  const match = btcData?.torrents[lowerHash];
  // console.info(btcData, match, lowerHash);
  return match;
}

export async function downloadMovieTorrent(url?: string, hash?: string) {
  if (!url || !hash) return false;

  try {
    if (!btcConfig.savePath) {
      btcConfig.savePath = await resolveBtcCategory(btcConfig.category);
    }

    const formData = new FormData();
    formData.append('urls', `${url}\n`);
    formData.append('root_folder', 'true');
    formData.append('autoTMM', 'true');
    if (!!btcConfig.category) {
      formData.append('category', btcConfig.category);
    }
    if (!!btcConfig.savePath) {
      formData.append('savepath', btcConfig.savePath);
    }
    // console.info(`Using path: '${btcConfig.savePath}'`);

    await fetch(`http://${btcConfig.address}:${btcConfig.port}/api/v2/torrents/add`, {
      ...btcOptions,
      method: 'POST',
      body: formData,
      headers: { ...btcOptions.headers },
    });

    return await wait(2000).then(() => findMovieTorrent(hash, false));
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function resolveBtcCategory(category?: string) {
  if (!category) return undefined;
  const btcData = await getBtcData();
  // console.info(`Found path: '${btcData?.categories?.[category].savePath}'`);
  return btcData?.categories?.[category].savePath;
}

export async function getBtcData(cache: boolean = true): Promise<BtcMainData | undefined> {
  if (!!btcDataCache && cache === true) return btcDataCache;

  const response = await fetch(`http://${btcConfig.address}:${btcConfig.port}/api/v2/sync/maindata`, {
    method: 'GET',
  });

  const json = await response.json();

  // console.info(response, json);
  btcDataCache = json as BtcMainData;
  return btcDataCache;
}

export function discoverMovies(): Promise<Movie[]> {
  return searchMovies(undefined);
}

export async function searchMovies(search?: string): Promise<Movie[]> {
  try {
    const response = await fetch(
      `${movieApiBaseUrl}/list_movies.json?with_rt_ratings=true${!!search ? `&query_term=${search}` : ''}`
    );
    const json = await response.json();
    return await mapResult(json?.data?.movies);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function validatePlex(): Promise<boolean> {
  // console.info(`Validating Plex`, plexConfig);
  const sectionsUrl = `http://${plexConfig.address}:${plexConfig.port}/library/sections`;
  const response = await fetch(sectionsUrl, {
    credentials: 'same-origin',
    method: 'GET',
    headers: [
      ['Accept', 'application/json'],
      ['X-Plex-Token', plexConfig.token as string],
    ],
  });

  if (response.status !== 200) {
    throw new Error(`Check your Plex config (${response.statusText})`);
  }

  const sectionMatch = ((await response.json()) as PlexResponse)?.MediaContainer?.Directory?.find(
    (d) => d.type === plexConfig.sectionType && d.title === plexConfig.section
  );
  plexConfig.sectionId = sectionMatch?.key;

  return !!plexConfig.sectionId;
}

export async function getPlexMachineId(): Promise<string> {
  const sectionsUrl = `http://${plexConfig.address}:${plexConfig.port}/`;
  const response = await fetch(sectionsUrl, {
    credentials: 'same-origin',
    method: 'GET',
    headers: [
      ['Accept', 'application/json'],
      ['X-Plex-Token', plexConfig.token as string],
    ],
  });
  const machineIdentifier = ((await response.json()) as PlexResponse)?.MediaContainer?.machineIdentifier;

  if (response.status !== 200 || !machineIdentifier) {
    throw new Error(`Check your Plex config (${response.statusText})`);
  }
  return machineIdentifier;
}

export async function findPlexMovie(search: string, year: number) {
  if (!search || search === '') return undefined;

  try {
    const bestMatch = await Promise.all([
      findPlexMovieWith('title', search, year),
      findPlexMovieWith('originalTitle', search, year),
    ]);
    return bestMatch.filter((v) => !!v).shift();
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

async function findPlexMovieWith(fieldName: keyof(MetadataSearchable), search: string, year: number) {
  try {
    const finalSearchUrl = `http://${plexConfig.address}:${plexConfig.port}/library/sections/${plexConfig.sectionId}/all?${fieldName}=${search}`;
    const response = await fetch(finalSearchUrl, {
      credentials: 'same-origin',
      method: 'GET',
      headers: [
        ['Accept', 'application/json'],
        ['X-Plex-Token', plexConfig.token as string],
      ],
    });

    const plex = (await response.json()) as PlexResponse;
    const bestMatch = plex?.MediaContainer?.Metadata?.find(
      (movie) => movie[fieldName].toLowerCase() === search.toLowerCase() && movie.year === year
    );
    return bestMatch;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

async function mapResult(res: any[]): Promise<Movie[]> {
  const result: Movie[] = [];
  for (const movie of res) {
    const {
      id,
      title,
      rating,
      mpa_rating,
      summary,
      genres,
      runtime,
      background_image,
      medium_cover_image,
      year,
      torrents: any_torrents,
    } = movie;

    const torrents = any_torrents as Torrent[];
    const torrent = torrents.find((t) => t.quality === '1080p') || torrents.find((t) => t.quality === '720p');
    const [plexMatch, btcMatch] = await Promise.all([
      findPlexMovie(movie.title, year),
      findMovieTorrent(torrent?.hash),
    ]);

    if (!!torrent) {
      result.push({
        id,
        title,
        year,
        summary,
        torrent,
        genres,
        runtime,
        rating,
        mpa_rating,
        btc: btcMatch,
        plex: plexMatch,
        downloaded: !!plexMatch,
        downloadChecked: true,
        background: background_image,
        cover: medium_cover_image,
      });
    }
  }
  return result;
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
