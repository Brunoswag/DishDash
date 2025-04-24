import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCardComponentComponent } from './recipe-card-component.component';

describe('RecipeCardComponentComponent', () => {
  let component: RecipeCardComponentComponent;
  let fixture: ComponentFixture<RecipeCardComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeCardComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeCardComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
