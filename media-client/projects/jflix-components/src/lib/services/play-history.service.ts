import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Media } from '../models/media.model';

@Injectable()
export class JflixPlayHistoryService {

  constructor(private http: HttpClient) { }

  getPlayHistory(): Observable<Media[]> {
    return this.http.get<Media[]>(`api/playhistory`);
  }

  updatePlayHistory(mediaId: number, lastPosition: number){
    this.http.post('api/playhistory', {mediaId, lastPosition}).subscribe(() => {
      console.log('play history updated');
    });
  }

  clearPlayHistory(mediaId: number){
    this.http.delete(`api/playhistory/${mediaId}`).subscribe(() => {
      console.log('play history cleared');
    });
  }
}
