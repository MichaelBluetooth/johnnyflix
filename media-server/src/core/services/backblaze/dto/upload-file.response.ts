export interface BackblazeUploadFileResponse {
    accountId: string;
    action: string;
    bucketId: string;
    contentLength: number;
    contentMd5: string;
    contentSha1: string;
    contentType: string;
    fileId: string;
    fileInfo: any,
    fileName: string;
    fileRetention: BackblazeUploadFileFileRetention;
    legalHold: BackblazeUploadFileLegalHold;
    serverSideEncryption: BackblazeUploadFileServerSideEncryption,
    uploadTimestamp: number;
};

export interface BackblazeUploadFileLegalHold {
    isClientAuthorizedToRead: boolean;
    value?: unknown;
}

export interface BackblazeUploadFileServerSideEncryption {
    algorithm?: unknown;
    mode?: unknown;
}

export interface BackblazeUploadFileFileRetention {
    isClientAuthorizedToRead: boolean;
    value: { mode: unknown, retainUntilTimestamp: unknown };
}