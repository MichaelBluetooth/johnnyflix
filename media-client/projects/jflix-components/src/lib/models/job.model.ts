export interface Job<T> {
    id: string;    
    type: 'transcode' | 'scan_library_files';
    status: string;
    completedDate?: Date;
    startedDate?: Date;
    failedReason?: string;
    data: T;
}

export type JobData = ScanLibraryFilesJobData | TranscodeJobData;

export interface ScanLibraryFilesJobData {
    libraryId: number;
    libraryName: string;
}

export interface TranscodeJobData {
    fileName: string;
    mediaId: number;
    mediaName: string;
    versionName: string;
}