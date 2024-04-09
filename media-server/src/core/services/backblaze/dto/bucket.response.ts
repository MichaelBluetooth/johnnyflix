export interface BackBlazeBucketResponse {
    accountId: string;
    bucketId: string;
    bucketInfo: any;
    bucketName: string;
    bucketType: string;
    corsRules: string[];
    defaultServerSideEncryption: BackblazeBucketDefaultServerSideEncryption;
    fileLockConfiguration: BackblazeBucketfileLockConfiguration;
    lifecycleRules: string[];
    options: string[];
    replicationConfiguration: { isClientAuthorizedToRead: boolean, value?: unknown };
    revision: number;
}


interface BackblazeBucketDefaultServerSideEncryption {
    isClientAuthorizedToRead: boolean;
    value: { algorithm?: unknown, mode?: unknown };
}

interface BackblazeBucketfileLockConfiguration {
    isClientAuthorizedToRead: boolean;
    value: { isFileLockEnabled: boolean, defaultRetention: { mode?: unknown, period?: unknown } };
}