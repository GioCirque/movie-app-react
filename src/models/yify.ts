import { Metadata } from "./plex";
import { BtcTorrent } from "./qbittorrent";

export interface Movie {
  id: number;
  year: number;
  title: string;
  rating: number;
  mpa_rating: string;
  summary: string;
  background: string;
  cover: string;
  genres: string[];
  runtime: number;
  torrent: Torrent;
  downloadChecked: boolean;
  downloaded: boolean;
  plex?: Metadata;
  btc?: BtcTorrent;
}

export interface Torrent {
  url: string;
  hash: string;
  quality: string;
  type: string;
  seeds: number;
  peers: number;
  size: string;
  size_bytes: number;
  date_uploaded: string;
  date_uploaded_unix: number;
}
