import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaGridComponent, ScanLibraryFilesBtnComponent } from 'jflix-components';
import { Library } from 'jflix-components';

@Component({
  selector: 'app-view-library',
  standalone: true,
  imports: [
    CommonModule,
    MediaGridComponent,
    ScanLibraryFilesBtnComponent
  ],
  templateUrl: './view-library.component.html',
  styleUrl: './view-library.component.scss'
})
export class ViewLibraryComponent implements OnInit {
  library: Library = null;

  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
      this.route.data.subscribe(d => {
        this.library = d['library'];
      });
  }
}
