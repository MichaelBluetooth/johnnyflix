import sanitize from "sanitize-filename";

export type HlsVersionName = 'small' | 'medium' | 'large';

export class HlsVersion {
    name: HlsVersionName;
    resolution: string;
    videoBitrate: string;
    audioBitrate: string;

    static readonly small: HlsVersion = {
        name: 'small',
        resolution: '320x180',
        videoBitrate: '500k',
        audioBitrate: '64k'
    };
    static readonly medium: HlsVersion = {
        name: 'medium',
        resolution: '854x480',
        videoBitrate: '1000k',
        audioBitrate: '128k'
    };
    static readonly large: HlsVersion = {
        name: 'large',
        resolution: '1280x720',
        videoBitrate: '2500k',
        audioBitrate: '192k'
    }

    static ALL: HlsVersion[] = [
        this.small,
        this.medium,
        this.large
    ];
}

export class HlsUtils {
    static getSafeFolderName(name: string): string {
        return sanitize(name);
    }

    static getHlsManifestFileName(fileName: string, resolution: string): string {
        const outputFileName = `${fileName}_${resolution}.m3u8`;
        return outputFileName;
    }
}