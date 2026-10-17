import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminCategory } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class AdminCategoriesService {
    private readonly baseUrl = `${environment.apiUrl}/admin/categories`;

    categories = signal<AdminCategory[]>([]);
    isLoading = signal<boolean>(false);

    // Categorías base con UUID y slug real según backend
    private fallbackCategories: AdminCategory[] = [
        { id: '11111111-1111-1111-1111-111111111111', slug: 'vialidad', name: 'Vialidad y Asfalto', colorHex: '#e11d48', displayOrder: 1, isActive: true },
        { id: '22222222-2222-2222-2222-222222222222', slug: 'alumbrado', name: 'Alumbrado Público', colorHex: '#f59e0b', displayOrder: 2, isActive: true },
        { id: '33333333-3333-3333-3333-333333333333', slug: 'arbolado', name: 'Arbolado y Espacios Verdes', colorHex: '#10b981', displayOrder: 3, isActive: true },
        { id: '44444444-4444-4444-4444-444444444444', slug: 'higiene', name: 'Higiene Urbana', colorHex: '#8b5cf6', displayOrder: 4, isActive: true },
        { id: '55555555-5555-5555-5555-555555555555', slug: 'agua', name: 'Obras Sanitarias y Agua', colorHex: '#0284c7', displayOrder: 5, isActive: true }
    ];

    constructor(private http: HttpClient) { }

    getCategories(): Observable<AdminCategory[]> {
        this.isLoading.set(true);
        return this.http.get<AdminCategory[]>(this.baseUrl, { withCredentials: true }).pipe(
            tap(cats => {
                this.categories.set(cats);
                this.isLoading.set(false);
            }),
            catchError(() => {
                this.categories.set(this.fallbackCategories);
                this.isLoading.set(false);
                return of(this.fallbackCategories);
            })
        );
    }

    createCategory(category: Omit<AdminCategory, 'id'>): Observable<AdminCategory> {
        return this.http.post<AdminCategory>(this.baseUrl, category, { withCredentials: true }).pipe(
            tap(created => {
                this.categories.update(list => [...list, created]);
            }),
            catchError(() => {
                const localCreated: AdminCategory = {
                    ...category,
                    id: crypto.randomUUID()
                };
                this.categories.update(list => [...list, localCreated]);
                return of(localCreated);
            })
        );
    }

    toggleActive(id: string, currentState: boolean): Observable<AdminCategory> {
        return this.http.patch<AdminCategory>(`${this.baseUrl}/${id}`, { isActive: !currentState }, { withCredentials: true }).pipe(
            tap(updated => {
                this.categories.update(list => list.map(c => c.id === id ? updated : c));
            }),
            catchError(() => {
                this.categories.update(list => list.map(c => c.id === id ? { ...c, isActive: !currentState } : c));
                const found = this.categories().find(c => c.id === id);
                return of(found!);
            })
        );
    }
}