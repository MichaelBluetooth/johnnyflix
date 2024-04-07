export interface JobData<T> {
    id: string;    
    type: 'transcode' | 'scan_library_files';
    status: string;
    completedDate?: Date;
    startedDate?: Date;
    failedReason?: string;
    data: T;
}

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