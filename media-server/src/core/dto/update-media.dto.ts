export interface UpdateMediaRequest {
    name: string;

    tags?: string[];
    description?: string;
    releaseYear?: number;
    duration?: number;

    posterFileName?: string;
    posterFileNames?: string[]

    versions: UpdateMediaVersion[];
}

export interface UpdateMediaVersion {
    name: string;
    optimize: boolean;
}

