import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JFlixAlertService, NavbarComponent } from 'jflix-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild("alertContainer", {static: true, read: ViewContainerRef}) alertContainer: ViewContainerRef;

  constructor(private alertService: JFlixAlertService){}

  ngOnInit(){
    this.alertService.setAlertViewContainer(this.alertContainer);
  }
}
