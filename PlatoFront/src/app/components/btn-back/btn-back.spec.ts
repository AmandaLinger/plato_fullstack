import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BtnBack } from './btn-back';

describe('BtnBack', () => {
  let component: BtnBack;
  let fixture: ComponentFixture<BtnBack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnBack],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnBack);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
