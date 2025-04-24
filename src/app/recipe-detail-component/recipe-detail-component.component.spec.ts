import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeDetailComponentComponent } from './recipe-detail-component.component';

describe('RecipeDetailComponentComponent', () => {
  let component: RecipeDetailComponentComponent;
  let fixture: ComponentFixture<RecipeDetailComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeDetailComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeDetailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
