import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Reports } from './reports';

describe('Reports', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reports],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create the reports component', () => {
    const fixture = TestBed.createComponent(Reports);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});