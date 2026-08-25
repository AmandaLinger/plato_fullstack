import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricasPage } from './metricas-page';

describe('MetricasPage', () => {
  let component: MetricasPage;
  let fixture: ComponentFixture<MetricasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricasPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
