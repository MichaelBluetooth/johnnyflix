import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LibraryService } from '../../services/library.service';
import { Library } from '../../models/library.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss'
})
export class SidePanelComponent implements OnInit {
  libraries: Library[] = [];

  @Output() menuItemClicked = new EventEmitter<void>();

  constructor(private librarySvc: LibraryService){}

  ngOnInit(): void {
    this.librarySvc.getLibraries().subscribe((libraries: Library[]) => {
      this.libraries = libraries;
    });
  }

  triggerMenuItemClicked(){
    this.menuItemClicked.next();
  }

}
