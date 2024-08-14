import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomStrategyComponent } from './custom-strategy.component';

describe('CustomStrategyComponent', () => {
  let component: CustomStrategyComponent;
  let fixture: ComponentFixture<CustomStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomStrategyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
