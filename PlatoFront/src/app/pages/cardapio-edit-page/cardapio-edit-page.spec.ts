import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardapioEditPage } from './cardapio-edit-page';

describe('CardapioEditPage', () => {
  let component: CardapioEditPage;
  let fixture: ComponentFixture<CardapioEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardapioEditPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardapioEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
