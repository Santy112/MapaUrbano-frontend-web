import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the sidebar', () => {
    const fixture = TestBed.createComponent(Sidebar);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});