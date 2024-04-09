import * as crypto from 'crypto';
import { BackblazeAuthorizeReponse } from "./dto/authorize.response";
import { BackblazeGetUploadUrlResponse } from "./dto/get-upload-url.response";
import { BackblazeUploadFileResponse } from "./dto/upload-file.response";
import { Logger } from '@nestjs/common';
import { BackblazeCreateBucketResponse } from './dto/create-bucket.response';
import { BackblazeListBucketsResponse } from './dto/list-buckets.response';

export class B2 {
    private readonly logger = new Logger(B2.name);
    private static readonly BACKBLAZE_AUTHORIZE_URL = 'https://api.backblazeb2.com/b2api/v3/b2_authorize_account';

    private apiUrl: string = null;
    private accountId: string = null;
    private authorizationToken: string = null;

    constructor(private applicationkeyId, private applicationKey) { }

    isAuthorized(){
        return null !== this.authorizationToken;
    }

    authorize() {
        const headers = {
            'Authorization': 'Basic ' + b64Encode(`${this.applicationkeyId}:${this.applicationKey}`)
        };

        // this.logger.debug(JSON.stringify(headers));

        return fetch(B2.BACKBLAZE_AUTHORIZE_URL, { method: 'get', headers: headers }).then(async (resp) => {
            const authResp: BackblazeAuthorizeReponse = await resp.json();
            // this.logger.debug(JSON.stringify(authResp));
            this.apiUrl = authResp.apiInfo.storageApi.apiUrl;
            this.accountId = authResp.accountId;
            this.authorizationToken = authResp.authorizationToken;
        });
    }

    getUploadUrl(bucketId: string): Promise<BackblazeGetUploadUrlResponse> {
        const headers = {
            'Authorization': this.authorizationToken
        };

        return fetch(`${this.apiUrl}/b2api/v3/b2_get_upload_url?bucketId=${bucketId}`, { method: 'get', headers: headers })
            .then(async (resp) => {
                const respAsJSON = await resp.json();
                // this.logger.debug(JSON.stringify(respAsJSON));
                return respAsJSON;
            });
    }

    async uploadFile(bucketId: string, fileName: string, file: Buffer): Promise<BackblazeUploadFileResponse> {
        const uploadDetail: BackblazeGetUploadUrlResponse = await this.getUploadUrl(bucketId);

        const sha1 = crypto.createHash('sha1').update(file).digest('hex');
        const uploadHeaders = {
            'Authorization': uploadDetail.authorizationToken,
            'X-Bz-File-Name': fileName,
            'X-Bz-Content-Sha1': sha1,
            'Content-Type': getContentTypeFromName(fileName),
            'Content-Length': file.byteLength.toString()
        }

        return fetch(uploadDetail.uploadUrl, { method: 'post', headers: uploadHeaders, body: file }).then(async (resp) => {
            const jsonResult = await resp.json();
            return jsonResult as BackblazeUploadFileResponse;
        });
    }

    createBucket(bucketName: string, bucketType: 'allPublic' | 'allPrivate'): Promise<BackblazeCreateBucketResponse> {
        const body = {
            accountId: this.accountId,
            bucketName: bucketName,
            bucketType: bucketType
        };

        const headers = {
            'Authorization': this.authorizationToken,
            'Content-Type': 'application/json'
        };

        return fetch(`${this.apiUrl}/b2api/v3/b2_create_bucket`, { method: 'post', headers: headers, body: JSON.stringify(body) })
            .then(async (resp) => {
                const respAsJSON = await resp.json();
                this.logger.debug(JSON.stringify(respAsJSON));
                return respAsJSON;
            });
    }

    listBuckets(): Promise<BackblazeListBucketsResponse> {
        const body = {
            accountId: this.accountId,
        };

        const headers = {
            'Authorization': this.authorizationToken,
            'Content-Type': 'application/json'
        };

        return fetch(`${this.apiUrl}/b2api/v3/b2_list_buckets`, { method: 'post', headers: headers, body: JSON.stringify(body) })
            .then(async (resp) => {
                const respAsJSON = await resp.json();
                this.logger.debug(JSON.stringify(respAsJSON));
                return respAsJSON;
            });
    }
}


export function b64Encode(content: string) {
    return Buffer.from(content).toString('base64')
}

export function getContentTypeFromName(fileName: string) {
    const fileNameLower = fileName.toLocaleLowerCase();
    if (fileNameLower.endsWith('.jpg') || fileNameLower.endsWith('.jpeg')) {
        return 'image/jpeg';
    } else if (fileNameLower.endsWith('.jpg')) {
        return 'image/png';
    } else if (fileNameLower.endsWith('.m4v') || fileNameLower.endsWith('.mp4')) {
        return 'video/mp4';
    } else if (fileNameLower.endsWith('.mkv')) {
        return 'video/x-matroska';
    } else if (fileNameLower.endsWith('.m3u8')) {
        return 'application/vnd.apple.mpegurl';
    } else if (fileNameLower.endsWith('.ts')) {
        return 'application/octet-stream';
    } else {
        throw Error(`Unknown content type: ${fileName}`);
    }
}