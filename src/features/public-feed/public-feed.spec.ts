import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicFeedComponent } from './public-feed';

describe('PublicFeed', () => {
  let component: PublicFeedComponent;
  let fixture: ComponentFixture<PublicFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicFeedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicFeedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
