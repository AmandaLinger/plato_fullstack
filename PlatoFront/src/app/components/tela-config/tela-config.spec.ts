import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaConfig } from './tela-config';

describe('TelaConfig', () => {
  let component: TelaConfig;
  let fixture: ComponentFixture<TelaConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
