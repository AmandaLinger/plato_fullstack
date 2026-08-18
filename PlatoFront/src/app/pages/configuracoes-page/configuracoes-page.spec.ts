import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracoesPage } from './configuracoes-page';

describe('ConfiguracoesPage', () => {
  let component: ConfiguracoesPage;
  let fixture: ComponentFixture<ConfiguracoesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracoesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
