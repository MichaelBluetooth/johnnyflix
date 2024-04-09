import { Injectable } from "@nestjs/common";
import { IStorageService } from "./storage.interface";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

@Injectable()
export class LocalStorageService implements IStorageService {
    initialize(): void {
        //nothing special for local storage
    }

    saveFile(path: string, fileName: string, file: Buffer): void {
        if (!existsSync(path)) {
            mkdirSync(path, { recursive: true });
        }

        const fileNameAndPath = join(path, fileName);
        writeFileSync(fileNameAndPath, file);
    }

    listFiles(path: string): string[] {
        const files = readdirSync(path);
        return files;
    }

}