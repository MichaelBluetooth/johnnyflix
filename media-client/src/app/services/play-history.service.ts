import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Job } from '../models/job.model';
import { Media } from '../models/media.model';

@Injectable({
  providedIn: 'root'
})
export class PlayHistoryService {

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
