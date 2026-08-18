import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnBack } from './btn-back';

describe('BtnBack', () => {
  let component: BtnBack;
  let fixture: ComponentFixture<BtnBack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnBack]
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
