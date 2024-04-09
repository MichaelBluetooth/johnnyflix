import { Injectable } from "@nestjs/common";
import { IStorageService } from "./storage.interface";

@Injectable()
export class BackblazeStorageService implements IStorageService {
    initialize(): void {        
    }

    saveFile(path: string, fileName: string, file: Buffer): void {
        
    }

    listFiles(path: string): string[] {
        return [];
    }
}