import { Component } from '@angular/core';
import { NavbarComponent } from 'jflix-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'johnnyflix-mobile';
}
