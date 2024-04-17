import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMediaModalComponent } from './edit-media-modal.component';

describe('EditMediaModalComponent', () => {
  let component: EditMediaModalComponent;
  let fixture: ComponentFixture<EditMediaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMediaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditMediaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
