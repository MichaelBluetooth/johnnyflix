export interface Media {
    id?: number;
    name?: string;
    libraryId?: number;
    fileName?: string;
    isOptimized?: boolean;

    
    lastPlayed?: Date;
    lastPosition?: number;
    
    poster?: string;
    releaseYear?: number;
    duration?: number;
    tags?: string[];
    description?: string;
    posterFileName?: string;

    versions?: MediaVersion[];
}

export interface MediaVersion {
    name: string,
    optimize: boolean;
}