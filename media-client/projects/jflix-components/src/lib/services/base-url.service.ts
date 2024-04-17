import { Injectable } from "@angular/core";

@Injectable()
export class JflixBaseUrlService {
    private _baseUrl: string = '/'

    get baseUrl() {
        return this._baseUrl;
    }

    setBaseUrl(url: string){
        this._baseUrl = url;
    }
}