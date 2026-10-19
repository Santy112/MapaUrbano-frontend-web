export type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
export type ReportPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type SubmissionMode = 'ACCOUNT' | 'ANONYMOUS';

export interface AdminAuthResponse {
    adminUserId: string;
    username: string;
    csrfToken: string;
}

export interface AdminUser {
    adminUserId: string;
    username: string;
}

export interface AdminCategory {
    id: string; // UUID
    slug: string;
    name: string;
    description?: string;
    icon?: string;
    colorHex: string;
    isActive: boolean;
    sortOrder: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface AdminReport {
    id: string; // UUID
    title: string;
    description: string;
    categorySlug: string;
    status: ReportStatus;
    priority: ReportPriority;
    latitude: number;
    longitude: number;
    address?: string;
    imageUrl?: string;
    hasImage?: boolean;
    assignedTeamId?: string | null;
    responsibleAdminUserId?: string | null;
    dueAt?: string | null;
    submissionMode: SubmissionMode;
    version: number;
    createdAt: string;
    updatedAt: string;
    statusHistory?: Array<{ status: ReportStatus; changedAt: string; changedBy: string; note?: string }>;
    priorityHistory?: Array<{ priority: ReportPriority; changedAt: string; changedBy: string }>;
}

export interface CursorPaginatedResponse<T> {
    items: T[];
    nextCursor: string | null;
    totalCount: number;
}

export interface AdminTeamMember {
    adminUserId: string;
    username: string;
    fullName: string;
    role: string;
}

export interface AdminTeam {
    id: string;
    name: string;
    specialty: string;
    isActive: boolean;
    members?: AdminTeamMember[];
}

export interface AdminStatistics {
    totalReports: number;
    byStatus: {
        pending?: number;
        inProgress?: number;
        resolved?: number;
        [key: string]: number | undefined;
    };
    byCategory: Record<string, number>;
    byPriority: {
        low?: number;
        medium?: number;
        high?: number;
        urgent?: number;
        [key: string]: number | undefined;
    };
    byTeam: Record<string, number>;
}

export interface AdminAuditEntry {
    id: string;
    timestamp: string;
    actor: string | null;
    role: string | null;
    module: string;
    action: string;
    details: string;
    ip: string;
    metadata?: Record<string, any>;
}

export interface ApiError {
    code: string;
    message: string;
    details?: any;
    requestId?: string;
}