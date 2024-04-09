// export interface IStorageService {
//     directoryExists(path: string): Promise<void>;
//     listFiles(path: string): Promise<string>;
//     removeDirectory(path: string): Promise<void>;
//     writeFile(fileNameAndPath: string, data: any);
// }

export interface IStorageService {
    initialize(): void;
    saveFile(path: string, fileName: string, file: Buffer): void;
    listFiles(path: string): string[];
}