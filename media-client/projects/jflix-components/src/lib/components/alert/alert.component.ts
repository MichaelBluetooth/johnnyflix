import { Component, EventEmitter, Input, Output } from '@angular/core';

export type AlertType = 'link' | 'primary' | 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'lib-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() isLight = false;
  @Input() message: string;

  @Output() dismiss = new EventEmitter();
}
