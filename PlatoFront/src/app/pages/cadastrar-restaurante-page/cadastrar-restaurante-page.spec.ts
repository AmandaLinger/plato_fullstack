import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { CadastrarRestaurantePage } from './cadastrar-restaurante-page';

describe('CadastrarRestaurantePage', () => {
  let component: CadastrarRestaurantePage;
  let fixture: ComponentFixture<CadastrarRestaurantePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarRestaurantePage],
      providers: [provideHttpClient()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarRestaurantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
