import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Media } from '../models/media.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  getHomeContent(): Observable<HomeContent> {
    return this.http.get<HomeContent>('api/home');
  }
}

export interface HomeContent {
    recentlyAdded: Media[];
    continueWatching: Media[];
    recentlyReleased: Media[];
}