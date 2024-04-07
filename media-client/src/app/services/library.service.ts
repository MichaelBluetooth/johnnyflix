import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Library } from '../models/library.model';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(private http: HttpClient) { }

  getMedia(libraryId: number): Observable<Library> {
    return this.http.get<Library>(`api/library/${libraryId}/media`);
  }

  getLibraries(): Observable<Library[]> {
    return this.http.get<Library[]>(`api/library`);
  }

  scanLibraryFiles(id: number) {
    this.http.post<any>(`api/library/${id}/scan`, {}).subscribe(() => {
      alert('Scanning library files');
    });
  }
}
