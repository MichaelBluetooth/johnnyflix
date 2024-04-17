import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JflixComponentsComponent } from './jflix-components.component';

describe('JflixComponentsComponent', () => {
  let component: JflixComponentsComponent;
  let fixture: ComponentFixture<JflixComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JflixComponentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JflixComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
