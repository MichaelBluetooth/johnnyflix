export interface MediaDetails {
    id: number;
    name: string;
    dateAdded: Date;
    tags?: string[];
    description?: string;
    duration?: number;
    releaseYear?: number;
    posterFileName: string;
    lastPlayed?: Date;
    lastPosition?: number;
    versions?: MediaVersion[];
    posters?: string[];
}

export interface MediaVersion {
    name: string;
    optimize: boolean;
}