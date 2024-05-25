import { Injectable } from "@angular/core";

// export type PlatformType = 'web' | 'ios' | 'android';

@Injectable()
export class JFlixPlatformService {
    private _platform: string;

    get platform(): string {
        return this._platform;
    }

    setPlatform(platform: string){
        this._platform = platform;
    }
}