import { Injectable, Logger, } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Library } from "./core/entities/library.entity";
import { Repository } from "typeorm";
import { LibraryDirectory } from "./core/entities/library-directory.entity";

@Injectable()
export class AppService {
  // private readonly logger = new Logger(AppService.name);

  // constructor(
  //   @InjectRepository(Location) private readonly libraryRepo: Repository<Library>,
  //   @InjectRepository(LibraryDirectory) private readonly libraryDirRepo: Repository<LibraryDirectory>
  // ) { }
}