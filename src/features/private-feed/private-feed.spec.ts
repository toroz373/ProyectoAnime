import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateFeedComponent } from './private-feed';

describe('PrivateFeed', () => {
  let component: PrivateFeedComponent;
  let fixture: ComponentFixture<PrivateFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateFeedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivateFeedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
