export interface TMDBSearchResponse {
    page: number;
    results: TMDBSearchResult[];
    total_pages: number;
    total_results: number;
}

export interface TMDBSearchResult {
    id: number;
    title: string;
    genre_ids: number[];
    release_date: string; //e.g. "2012-08-02"
    poster_path: string;
    backdrop_path: string;
    adult: boolean;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    video: boolean;
    vote_average: number;
    voute_count: number;
}