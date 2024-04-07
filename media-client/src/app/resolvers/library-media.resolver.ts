import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LibraryService } from '../services/library.service';
import { Library } from '../models/library.model';

export const libraryMediaResolver: ResolveFn<Library> = (route, state) => {
  const librarySvc = inject(LibraryService);
  return librarySvc.getMedia(+route.params['id']);
};
