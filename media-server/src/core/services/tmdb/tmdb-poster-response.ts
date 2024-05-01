export interface TMDBPosterResponse {
    id: number;
    posters: TMDBPosterFile[];
    backdrops: TMDBPosterFile[];
    logos: TMDBPosterFile[];
}

interface TMDBPosterFile {
    file_path: string;
    aspect_ratio: number;
    height: number;
    width: number;
    iso_639_1: string;
    vote_average: number;
    vote_count: number;
}