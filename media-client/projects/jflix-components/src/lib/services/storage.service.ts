import { Injectable } from "@angular/core";
import { GetResult, Preferences } from '@capacitor/preferences';
import { EMPTY, Observable, from, map, of } from "rxjs";
import { JFlixPlatformService } from "./platform.service";

@Injectable()
export class JFlixStorageService {
    private readonly storage: IStorageUtility;

    constructor(platformService: JFlixPlatformService) {
        this.storage = platformService.platform === 'web' ? new WebStorage() : new MobileStorage();
    }

    setItem(key: string, value: string): void {
        this.storage.setItem(key, value);
    }

    removeItem(key: string): void {
        this.storage.removeItem(key);
    }

    getItem(key: string): Observable<string> {
        return this.storage.getItem(key);
    }
}

interface IStorageUtility {
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    getItem(key: string): Observable<string>;
}

class WebStorage implements IStorageUtility {
    setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    getItem(key: string): Observable<string> {
        return of(localStorage.getItem(key));
    }
}

class MobileStorage implements IStorageUtility {
    setItem(key: string, value: string): void {
        Preferences.set({ key, value });
    }

    removeItem(key: string): void {
        Preferences.remove({ key });
    }

    getItem(key: string): Observable<string> {
        return from(Preferences.get({ key })).pipe(map((value: GetResult) => {
            return value.value;
        }));
    }
}