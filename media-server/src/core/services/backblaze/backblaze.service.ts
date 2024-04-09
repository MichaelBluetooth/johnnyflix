import { Injectable, Logger } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import { B2 } from './backblaze';
import { BackblazeCreateBucketResponse } from './dto/create-bucket.response';
import { BackblazeListBucketsResponse } from './dto/list-buckets.response';

@Injectable()
export class BackblazeService {
    private readonly logger = new Logger(BackblazeService.name);
    private b2: B2;

    constructor(settings: SettingsService) {
        const b2Opts = settings.backblazeConfig;
        this.b2 = new B2(b2Opts.keyID, b2Opts.applicationKey);
    }

    async createBucket(bucketName: string, bucketType: 'allPublic' | 'allPrivate'): Promise<BackblazeCreateBucketResponse> {
        await this.authorizeIfNeeded();
        return this.b2.createBucket(bucketName, bucketType);
    }

    async listBuckets(): Promise<BackblazeListBucketsResponse> {
        await this.authorizeIfNeeded();
        return this.b2.listBuckets();
    }

    private async authorizeIfNeeded() {
        if (!this.b2.isAuthorized()) {
            this.logger.debug('Authorizing B2');
            await this.b2.authorize();
        }
    }
}
