export type UserRole = 'user' | 'professional' | 'admin';

export interface User {
    id: string;
    email: string;
    name: string;
    roles: UserRole[];
    profileImage?: string;
    preferences?: UserPreferences;
    professionalProfile?: ProfessionalProfile;
    createdAt: string;
    updatedAt: string;
}

export interface UserPreferences {
    theme: 'light' | 'dark';
    emailNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    currency: string;
}

export interface ProfessionalProfile {
    id: string;
    bio: string;
    specialties: string[];
    experience: number;
    certifications: Certification[];
    portfolio: Portfolio;
    services: Service[];
    availability: Availability;
    rating: number;
    reviewCount: number;
}

export interface Certification {
    name: string;
    issuer: string;
    dateIssued: string;
    expiryDate?: string;
    verificationUrl?: string;
}

export interface Portfolio {
    looks: Look[];
    beforeAfter: BeforeAfter[];
    videos: Video[];
    featured: boolean;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    currency: string;
}

export interface Availability {
    schedule: Schedule[];
    timezone: string;
    bookingLeadTime: number;
    bookingWindow: number;
}

export interface Schedule {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    breaks: TimeSlot[];
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
}

export interface Look {
    id: string;
    title: string;
    description: string;
    images: Image[];
    products: Product[];
    tags: string[];
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    timeEstimate: number;
    views: number;
    likes: number;
    createdAt: string;
}

export interface BeforeAfter {
    id: string;
    before: Image;
    after: Image;
    description: string;
    products: Product[];
    technique: string;
    timeSpent: number;
}

export interface Video {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    duration: number;
    views: number;
    likes: number;
}

export interface Image {
    id: string;
    url: string;
    width: number;
    height: number;
    alt: string;
    type: 'thumbnail' | 'full' | 'original';
}

export interface Product {
    id: string;
    name: string;
    brand: string;
    category: string;
    description: string;
    price: number;
    currency: string;
    images: Image[];
    rating: number;
    reviewCount: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
    professionalData?: ProfessionalRegistrationData;
}

export interface ProfessionalRegistrationData {
    bio: string;
    specialties: string[];
    experience: number;
    certifications: Omit<Certification, 'id'>[];
}
