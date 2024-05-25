import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { JFlixStorageService } from './storage.service';

@Injectable()
export class JFlixAuthService {
    private readonly ACCESS_TOKEN_KEY = 'jflix_auth_token';

    constructor(private http: HttpClient, private storage: JFlixStorageService) { }

    login(email: string, password: string) {
        return this.http.post<LoginResponse>('api/auth/login', { email, password }).pipe(tap((resp) => {
            this.storage.setItem(this.ACCESS_TOKEN_KEY, resp.access_token);
        }));
    }

    logout() {
        return this.http.delete('api/auth/logout').pipe(tap(() => {
            this.clearAccessToken();
        }));
    }

    isLoggedIn() {
        return this.http.get('api/auth/ping');
    }

    getAccessToken() {
        return this.storage.getItem(this.ACCESS_TOKEN_KEY);
    }

    clearAccessToken() {
        this.storage.removeItem(this.ACCESS_TOKEN_KEY);
    }
}

interface LoginResponse {
    access_token: string;
}