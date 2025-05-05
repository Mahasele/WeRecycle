import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuidelinesPage } from './guidelines.page';

describe('GuidelinesPage', () => {
  let component: GuidelinesPage;
  let fixture: ComponentFixture<GuidelinesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidelinesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
