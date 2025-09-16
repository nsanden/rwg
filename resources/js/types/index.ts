export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Auth {
    user: User | null;
}

export interface HomepageProps {
    auth: Auth;
}

export interface WordGenerationResponse {
    words: string[];
    success: boolean;
}

export interface WordGenerationParams {
    quantity: number;
    type: 'all' | 'basic' | 'noun' | 'verb' | 'adjective' | 'extended' | 'non-english';
    language: 'en' | 'es' | 'hi' | 'ar' | 'de' | 'ru' | 'zh' | 'jp' | 'ko' | 'la' | 'it';
    firstLetter?: string;
    lastLetter?: string;
    sizeType?: 'syllables' | 'letters';
    comparing?: 'equals' | 'less_than' | 'greater_than';
    count?: number;
}

export interface ValidationError {
    message: string;
    errors: Record<string, string[]>;
}

export interface PageProps {
    auth: Auth;
    ziggy?: any;
    flash?: any;
    errors?: any;
    [key: string]: any;
}