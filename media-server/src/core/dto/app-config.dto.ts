import { HlsVersionName } from "../utils/hls-utils";

export interface AppConfig {
    default_versions: HlsVersionName[];
    libraries: { name: string, directories: string[], type: 'local' | 'backblaze' }[];
}