import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MediaListComponent } from 'jflix-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidePanelComponent, NavbarComponent, MediaListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('nav', { static: true }) nav: ElementRef;

  ngOnInit() { }
}
