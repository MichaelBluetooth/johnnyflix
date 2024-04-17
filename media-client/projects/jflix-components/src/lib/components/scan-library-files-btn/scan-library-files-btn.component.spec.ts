import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanLibraryFilesBtnComponent } from './scan-library-files-btn.component';

describe('ScanLibraryFilesBtnComponent', () => {
  let component: ScanLibraryFilesBtnComponent;
  let fixture: ComponentFixture<ScanLibraryFilesBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanLibraryFilesBtnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScanLibraryFilesBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
