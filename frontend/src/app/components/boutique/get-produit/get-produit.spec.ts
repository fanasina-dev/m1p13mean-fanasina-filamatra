import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetProduit } from './get-produit';

describe('GetProduit', () => {
  let component: GetProduit;
  let fixture: ComponentFixture<GetProduit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetProduit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetProduit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
