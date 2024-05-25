import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidePanelComponent } from '../side-panel/side-panel.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidePanelComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  showMenu = false;

  ngOnInit(): void {
  }

  menuItemClicked() {
    this.showMenu = false;
  }

  logout(){

  }
}
