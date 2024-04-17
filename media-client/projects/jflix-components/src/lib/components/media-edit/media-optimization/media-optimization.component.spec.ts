import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaOptimizationComponent } from './media-optimization.component';

describe('MediaOptimizationComponent', () => {
  let component: MediaOptimizationComponent;
  let fixture: ComponentFixture<MediaOptimizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaOptimizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MediaOptimizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
