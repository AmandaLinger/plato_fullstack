import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemHome } from './item-home';

describe('ItemHome', () => {
  let component: ItemHome;
  let fixture: ComponentFixture<ItemHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
