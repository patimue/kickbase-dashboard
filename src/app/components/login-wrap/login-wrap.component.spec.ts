import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginWrapComponent } from './login-wrap.component';

describe('LoginWrapComponent', () => {
  let component: LoginWrapComponent;
  let fixture: ComponentFixture<LoginWrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginWrapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
