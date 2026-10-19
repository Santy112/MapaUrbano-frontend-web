import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Audit } from './audit';

describe('Audit', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Audit],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create the audit component', () => {
    const fixture = TestBed.createComponent(Audit);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});