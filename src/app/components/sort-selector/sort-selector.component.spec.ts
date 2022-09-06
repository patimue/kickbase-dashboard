import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortSelectorComponent } from './sort-selector.component';

describe('SortSelectorComponent', () => {
  let component: SortSelectorComponent;
  let fixture: ComponentFixture<SortSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SortSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
