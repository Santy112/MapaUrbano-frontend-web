import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Statistics } from './statistics';

describe('Statistics', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Statistics],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create the statistics component', () => {
    const fixture = TestBed.createComponent(Statistics);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});