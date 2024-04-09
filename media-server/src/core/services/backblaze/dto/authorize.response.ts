export interface BackblazeAuthorizeReponse {
    accountId: string;
    applicationKeyExpirationTimestamp?: Date;
    authorizationToken: string;
    apiInfo: BackblazeAuthorizeReponseApiInfo;
}

export interface BackblazeAuthorizeReponseApiInfo {
    storageApi: BackblazeAuthorizeReponseStorageApi;
}

export interface BackblazeAuthorizeReponseStorageApi {
    absoluteMinimumPartSize: number;
    apiUrl: string;
    capabilities: string[];
    downloadUrl: string;
    infoType: string;
    namePrefix?: string;
    recommendedPartSize: number;
    s3ApiUrl: string;
    bucketId?: string;
    bucketName?: string;
}