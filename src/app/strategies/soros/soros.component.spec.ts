import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SorosComponent } from './soros.component';

describe('SorosComponent', () => {
  let component: SorosComponent;
  let fixture: ComponentFixture<SorosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SorosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SorosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
