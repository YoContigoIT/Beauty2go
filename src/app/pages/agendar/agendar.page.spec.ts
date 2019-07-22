import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarPage } from './agendar.page';

describe('AgendarPage', () => {
  let component: AgendarPage;
  let fixture: ComponentFixture<AgendarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
