export interface TmdbMovie {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string;
  poster_path?: string;
  release_date?: string;
}

export interface TmdbSearchResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}
