import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  showMenu = true;

  ngOnInit(): void {
    this.showMenu = !this.isMobile();
  }

  isMobile() {
    if (window.matchMedia('screen and (max-width: 912px)').matches) {
      return true;
    } else {
      return false;
    }
  }
}
