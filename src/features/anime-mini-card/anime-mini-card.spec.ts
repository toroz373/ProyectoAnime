import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeMiniCard } from './anime-mini-card';

describe('AnimeMiniCard', () => {
  let component: AnimeMiniCard;
  let fixture: ComponentFixture<AnimeMiniCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimeMiniCard],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimeMiniCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
