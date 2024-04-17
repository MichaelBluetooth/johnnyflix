import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaPosterSelectorComponent } from './media-poster-selector.component';

describe('MediaPosterSelectorComponent', () => {
  let component: MediaPosterSelectorComponent;
  let fixture: ComponentFixture<MediaPosterSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaPosterSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MediaPosterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
