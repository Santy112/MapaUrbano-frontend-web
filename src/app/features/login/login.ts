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
    showPassword = false;
    errorMessage = '';
    isSubmitting = false;

    constructor(
        private authService: AdminAuthService,
        private router: Router
    ) { }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    onSubmit(): void {
        if (!this.username.trim() || !this.password) {
            this.errorMessage = 'Por favor complete todos los campos requeridos.';
            return;
        }

        this.isSubmitting = true;
        this.errorMessage = '';

        this.authService.login({ username: this.username.trim(), password: this.password }).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.isSubmitting = false;
                if (err.status === 401) {
                    this.errorMessage = 'Credenciales no autorizadas o datos incorrectos.';
                } else if (err.status === 403) {
                    this.errorMessage = 'Acceso denegado: el usuario no posee rol administrativo.';
                } else {
                    this.errorMessage = err.error?.message || 'Error de conexión con el servidor. Intente nuevamente.';
                }
            }
        });
    }
}