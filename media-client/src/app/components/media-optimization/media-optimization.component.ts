import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MediaVersionNamePipe } from '../../pipes/media-version-name.pipe';

@Component({
  selector: 'app-media-optimization',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MediaVersionNamePipe
  ],
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
