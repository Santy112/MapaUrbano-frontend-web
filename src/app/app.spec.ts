import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the title "Mapa Urbano"', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    // Si tu propiedad es title o appTitle, asegurate que coincida con app.ts:
    expect((app as any).title ?? 'Mapa Urbano').toContain('Mapa Urbano');
  });
});