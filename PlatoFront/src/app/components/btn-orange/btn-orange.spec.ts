import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnOrange } from './btn-orange';

describe('BtnOrange', () => {
  let component: BtnOrange;
  let fixture: ComponentFixture<BtnOrange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnOrange]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnOrange);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
