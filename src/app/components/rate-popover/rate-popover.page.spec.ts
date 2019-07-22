import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatePopoverPage } from './rate-popover.page';

describe('RatePopoverPage', () => {
  let component: RatePopoverPage;
  let fixture: ComponentFixture<RatePopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatePopoverPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatePopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
