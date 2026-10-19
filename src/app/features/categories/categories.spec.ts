import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Categories } from './categories';

describe('Categories', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Categories],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create the categories component', () => {
    const fixture = TestBed.createComponent(Categories);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});