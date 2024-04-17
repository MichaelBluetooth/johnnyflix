import { Component, Input } from '@angular/core';
import { JflixLibraryService } from '../../services/library.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jflix-scan-library-files-btn',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './scan-library-files-btn.component.html',
  styleUrl: './scan-library-files-btn.component.scss'
})
export class ScanLibraryFilesBtnComponent {
  @Input() libraryId: number;

  showModal = false;

  constructor(private libraries: JflixLibraryService){}

  scanLibraryFiles(){
    this.libraries.scanLibraryFiles(this.libraryId).subscribe(() => {
      this.showModal = true;
    });
  }
}
