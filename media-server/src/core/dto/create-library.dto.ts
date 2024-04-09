export interface CreateLibraryRequest {
    name: string;
    directories: string[];
    type: 'local' | 'backblaze';
    backblazeBucketId?: string;
    backblazeBucketName?: string;
}