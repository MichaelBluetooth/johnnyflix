import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLibraryRequest } from 'src/core/dto/create-library.dto';
import { LibraryDirectory } from 'src/core/entities/library-directory.entity';
import { Library } from 'src/core/entities/library.entity';
import { Repository } from 'typeorm';
import { BackblazeService } from '../backblaze/backblaze.service';
import { randomUUID } from 'crypto';

@Injectable()
export class B2LibraryService {
    private readonly logger = new Logger(B2LibraryService.name);

    constructor(
        @InjectRepository(Library) private libraryRepo: Repository<Library>,
        private b2: BackblazeService) { }

    async createLibrary(data: CreateLibraryRequest): Promise<Library> {
        let bucketId = data.backblazeBucketId;
        const bucketName = data.backblazeBucketName ? data.backblazeBucketName : `johnnyflix-${randomUUID()}`;
        this.logger.debug(`B2 bucket: ${bucketName}`);
        
        if (!bucketId) {
            const buckets = (await this.b2.listBuckets()).buckets;
            let existingBucket = buckets.find(bucket => bucket.bucketName === bucketName);
            this.logger.debug(`Found existing bucket: ${existingBucket?.bucketId}`);
            if (!existingBucket) {
                existingBucket = await this.b2.createBucket(bucketName, 'allPrivate');
                bucketId = existingBucket.bucketId;
                this.logger.debug(`Created bucket: ${bucketId}`);
            }
        }

        const library = new Library();
        library.name = data.name;
        library.backblazeBucketId = bucketId;
        library.backblazeBucketName = bucketName;
        library.type = data.type;
        library.directories = [];
        data.directories.forEach((dir: string) => {
            const directory = new LibraryDirectory();
            directory.path = dir;
            library.directories.push(directory);
        });
        return this.libraryRepo.save(library);
    }

    deleteLibrary(library: Library): Promise<Library> {
        this.logger.debug(`Deleting library: '${library.name}' - THIS DOES NOT DELETE THE B2 BUCKET`);
        return this.libraryRepo.remove(library);
    }
}
