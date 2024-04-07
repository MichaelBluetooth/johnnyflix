import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLibraryRequest } from 'src/core/dto/create-library.dto';
import { LibraryDirectory } from 'src/core/entities/library-directory.entity';
import { Library } from 'src/core/entities/library.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LibraryService {
    constructor(
        @InjectRepository(Library) private libraryRepo: Repository<Library>,
        @InjectRepository(LibraryDirectory) private libraryDirectoryRepo: Repository<LibraryDirectory>) { }

    createLibrary(data: CreateLibraryRequest): Promise<Library> {
        const library = new Library();
        library.name = data.name;
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
