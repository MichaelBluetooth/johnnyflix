export interface AssociateMediaRequest {
    libraryId: number;
    name: string;
    fileName: string;
    filePath: string;

    tags?: string[];
    description?: string;
    releaseYear?: number;
    duration?: number;
    posterFileName?: string;
}