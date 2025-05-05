import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecyclersPage } from './recyclers.page';

describe('RecyclersPage', () => {
  let component: RecyclersPage;
  let fixture: ComponentFixture<RecyclersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecyclersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
