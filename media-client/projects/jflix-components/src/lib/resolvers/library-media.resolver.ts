import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { JflixLibraryService } from '../services/library.service';
import { Library } from '../models/library.model';

export const libraryMediaResolver: ResolveFn<Library> = (route, state) => {
  const librarySvc = inject(JflixLibraryService);
  return librarySvc.getMedia(+route.params['id']);
};
