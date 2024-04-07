export interface CreateMediaRequest {
    libraryId: number;
    name: string;

    fileName: string;

    tags?: string[];
    description?: string;
    releaseYear?: number;
    duration?: number;

    posterFileName?: string;
    posterFileNames?: string[];

    versions: CreateMediaVersion[];
}

export interface CreateMediaVersion {
    name: string;
    optimize: boolean;
}