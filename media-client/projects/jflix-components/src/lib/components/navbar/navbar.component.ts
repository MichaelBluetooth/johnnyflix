import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import { JFlixAuthService } from '../../services/auth.service';

@Component({
  selector: 'jflix-navbar',
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

  constructor(private auth: JFlixAuthService, private router: Router){}

  ngOnInit(): void {
  }

  menuItemClicked() {
    this.showMenu = false;
  }

  logout(){
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
