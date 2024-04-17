export interface Media {
    id?: number;
    name?: string;
    libraryId?: number;

    lastPlayed?: Date;
    lastPosition?: number;
    
    poster?: string;
    releaseYear?: number;
    duration?: number;
    tags?: string[];
    description?: string;
    posterFileName?: string;
}