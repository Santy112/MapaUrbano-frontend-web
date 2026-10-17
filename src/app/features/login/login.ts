import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../core/services/admin-auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class Login {
    username = '';
    password = '';
    errorMessage = '';
    isSubmitting = false;

    constructor(
        private authService: AdminAuthService,
        private router: Router
    ) { }

    onSubmit(): void {
        if (!this.username || !this.password) {
            this.errorMessage = 'Por favor complete todos los campos requeridos.';
            return;
        }

        this.isSubmitting = true;
        this.errorMessage = '';

        this.authService.login({ username: this.username, password: this.password }).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.isSubmitting = false;
                if (err.status === 401) {
                    this.errorMessage = 'Credenciales no autorizadas o incorrectas.';
                } else if (err.status === 403) {
                    this.errorMessage = 'Acceso denegado: el usuario no posee rol administrativo.';
                } else if (err.status === 501 || err.status === 0) {
                    this.errorMessage = 'Servicio de autenticación en desarrollo en backend (simulando acceso local).';
                    // Simulación temporal controlada si el backend aún no instaló cookies:
                    this.authService.currentUser.set({
                        id: 'mock-admin-uuid',
                        username: this.username,
                        fullName: 'Operador Técnico',
                        role: 'ADMIN'
                    });
                    this.router.navigate(['/']);
                } else {
                    this.errorMessage = 'Ocurrió un error inesperado al conectar con el servidor.';
                }
            }
        });
    }
}