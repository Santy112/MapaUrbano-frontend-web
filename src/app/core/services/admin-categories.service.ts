import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminCategory } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class AdminCategoriesService {
    private readonly baseUrl = `${environment.apiUrl}/admin/categories`;

    categories = signal<AdminCategory[]>([]);
    isLoading = signal<boolean>(false);

    constructor(private http: HttpClient) { }

    getCategories(): Observable<AdminCategory[]> {
        this.isLoading.set(true);
        return this.http.get<AdminCategory[]>(this.baseUrl).pipe(
            tap(cats => {
                this.categories.set(cats);
                this.isLoading.set(false);
            })
        );
    }

    createCategory(category: Omit<AdminCategory, 'id'>): Observable<AdminCategory> {
        return this.http.post<AdminCategory>(this.baseUrl, category).pipe(
            tap(created => {
                this.categories.update(list => [...list, created]);
            })
        );
    }

    updateCategory(id: string, changes: Partial<AdminCategory>): Observable<AdminCategory> {
        return this.http.patch<AdminCategory>(`${this.baseUrl}/${id}`, changes).pipe(
            tap(updated => {
                this.categories.update(list => list.map(c => c.id === id ? updated : c));
            })
        );
    }
}