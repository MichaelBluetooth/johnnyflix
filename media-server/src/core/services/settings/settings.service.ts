import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { AppConfig } from 'src/core/dto/app-config.dto';
import { HlsVersionName } from 'src/core/utils/hls-utils';

@Injectable()
export class SettingsService {
    private readonly logger = new Logger(SettingsService.name);

    private appConfig: AppConfig;

    readSettings() {
        try {
            const appConfigRaw = readFileSync('.\\app_config.json', 'utf8');
            this.appConfig = JSON.parse(appConfigRaw) as AppConfig;
            this.logger.debug('Launching server with config');
            this.logger.debug(appConfigRaw);
        } catch (error) {
            this.logger.error('Error reading app config');
            this.logger.error(error);
        }
    }

    get defaultVersions(): Set<HlsVersionName> {
        return new Set(this.appConfig.default_versions);
    }

    get defaultLibraries(): { name: string, directories: string[] }[] {
        return this.appConfig.libraries;
    }
}
