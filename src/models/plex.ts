export interface Part {
  id: number;
  key: string;
  duration: number;
  file: string;
  size: number;
  audioProfile: string;
  container: string;
  indexes: string;
  videoProfile: string;
}

export interface Media {
  id: number;
  duration: number;
  bitrate: number;
  width: number;
  height: number;
  aspectRatio: number;
  audioChannels: number;
  audioCodec: string;
  videoCodec: string;
  videoResolution: string;
  container: string;
  videoFrameRate: string;
  audioProfile: string;
  videoProfile: string;
  Part: Part[];
}

export interface Genre {
  tag: string;
}

export interface Director {
  tag: string;
}

export interface Writer {
  tag: string;
}

export interface Country {
  tag: string;
}

export interface Collection {
  tag: string;
}

export interface Role {
  tag: string;
}

export interface MetadataSearchable {
  ratingKey: string;
  key: string;
  guid: string;
  studio: string;
  type: string;
  title: string;
  originalTitle: string;
  contentRating: string;
  summary: string;
  tagline: string;
  thumb: string;
  art: string;
  originallyAvailableAt: string;
  audienceRatingImage: string;
  primaryExtraKey: string;
  ratingImage: string;
}

export interface Metadata extends MetadataSearchable {
  rating: number;
  audienceRating: number;
  year: number;
  duration: number;
  addedAt: number;
  updatedAt: number;
  Media: Media[];
  Genre: Genre[];
  Director: Director[];
  Writer: Writer[];
  Country: Country[];
  Collection: Collection[];
  Role: Role[];
}

export interface Location {
  id: number;
  path: string;
}

export interface Directory {
  allowSync: boolean;
  art: string;
  composite: string;
  filters: boolean;
  refreshing: boolean;
  thumb: string;
  key: string;
  type: string;
  title: string;
  agent: string;
  scanner: string;
  language: string;
  uuid: string;
  updatedAt: number;
  createdAt: number;
  scannedAt: number;
  content: boolean;
  directory: boolean;
  contentChangedAt: number;
  hidden: number;
  location: Location[];
}

export interface MediaContainer {
  size: number;
  allowSync: boolean;
  art: string;
  identifier: string;
  librarySectionID: number;
  librarySectionTitle: string;
  librarySectionUUID: string;
  machineIdentifier?: string;
  mediaTagPrefix: string;
  mediaTagVersion: number;
  thumb: string;
  title1: string;
  title2: string;
  viewGroup: string;
  viewMode: number;
  Metadata?: Metadata[];
  Directory?: Directory[];
}

export interface PlexResponse {
  MediaContainer: MediaContainer;
}

export interface PlexConfig {
  address?: string;
  port?: string;
  token?: string;
  section?: string;
  sectionType?: string;
  sectionId?: string;
}
