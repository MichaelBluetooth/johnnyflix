import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLibraryRequest } from 'src/core/dto/create-library.dto';
import { LibraryDirectory } from 'src/core/entities/library-directory.entity';
import { Library } from 'src/core/entities/library.entity';
import { Repository } from 'typeorm';
import { BackblazeService } from '../backblaze/backblaze.service';

@Injectable()
export class LibraryService {
    private readonly logger = new Logger(LibraryService.name);

    constructor(
        @InjectRepository(Library) private libraryRepo: Repository<Library>,
        @InjectRepository(LibraryDirectory) private libraryDirectoryRepo: Repository<LibraryDirectory>,
        private b2: BackblazeService) { }

    createLibrary(data: CreateLibraryRequest): Promise<Library> {

        if (data.type === 'backblaze') {
            this.logger.debug(`Creating B2 bucket: ${data.backblazeBucketName}`);
        }

        const library = new Library();
        library.name = data.name;
        library.backblazeBucketId = data.backblazeBucketId;
        library.backblazeBucketName = data.backblazeBucketName;
        library.type = data.type;
        library.directories = [];
        data.directories.forEach((dir: string) => {
            const directory = new LibraryDirectory();
            directory.path = dir;
            library.directories.push(directory);
        });
        return this.libraryRepo.save(library);
    }

    addLibraryDirectory(libraryId: number, dir: string) {
        const directory = new LibraryDirectory();
        directory.libraryId = libraryId;
        directory.path = dir;
        return this.libraryDirectoryRepo.save(directory);
    }

    async deleteLibraryDirectory(id: number) {
        const doomed = await this.libraryDirectoryRepo.findOneBy({ id });
        return this.libraryDirectoryRepo.remove(doomed);
    }

    getLibrary(id: number): Promise<Library> {
        return this.libraryRepo.createQueryBuilder('lib')
            .leftJoinAndSelect('lib.directories', 'dir')
            .leftJoinAndSelect('lib.media', 'med')
            .where('lib.id = :id', { id })
            .getOne();
    }

    getLibraries(): Promise<Library[]> {
        return this.libraryRepo.createQueryBuilder('lib')
            .leftJoinAndSelect('lib.directories', 'dir')
            .getMany();
    }

    deleteLibrary(library: Library): Promise<Library> {
        return this.libraryRepo.remove(library);
    }
}
