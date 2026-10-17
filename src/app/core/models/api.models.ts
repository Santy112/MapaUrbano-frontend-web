export type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export type ReportPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AdminUser {
    id: string;
    username: string;
    fullName: string;
    role: 'ADMIN' | 'OPERATOR' | 'INSPECTOR';
}

export interface AdminCategory {
    id: string; // UUID
    slug: string;
    name: string;
    colorHex: string;
    displayOrder: number;
    isActive: boolean;
}

export interface AdminReport {
    id: number;
    title: string;
    description: string;
    categorySlug: string;
    status: ReportStatus;
    priority: ReportPriority;
    latitude: number;
    longitude: number;
    address?: string;
    imageUrl?: string;
    assignedTeamId?: string;
    assignedUserId?: string;
    targetResolutionDate?: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
export interface AdminAuditEntry {
    id: number;
    timestamp: string;
    actor: string | null;
    role: string | null;
    module: string;
    action: 'CREAR' | 'MODIFICAR' | 'ESTADO' | 'ELIMINAR';
    details: string;
    ip: string;
}