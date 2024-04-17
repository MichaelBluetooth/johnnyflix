import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'jflix-media-optimization',
  templateUrl: './media-optimization.component.html',
  styleUrl: './media-optimization.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MediaOptimizationComponent),
      multi: true
    }
  ]
})
export class MediaOptimizationComponent implements ControlValueAccessor {

  disabled = false;
  values = [];

  onChange: any = () => { }
  onTouch: any = () => { }

  writeValue(obj: any): void {
    this.values = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
