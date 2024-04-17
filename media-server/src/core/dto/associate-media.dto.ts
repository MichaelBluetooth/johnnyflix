export interface AssociateMediaRequest {
    libraryId: number;
    name: string;
    fileName: string;
    filePath: string;
    
    dateAdded?: Date;

    tags?: string[];
    description?: string;
    releaseYear?: number;
    duration?: number;
    posterFileName?: string;
    availablePosters?: string[];
}