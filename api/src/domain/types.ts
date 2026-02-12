export type Species = 'DOG' | 'CAT';
export type PetSize = 'SMALL' | 'MEDIUM' | 'LARGE';
export type RideCategory = 'BASIC' | 'PLUS' | 'SUV' | 'VET';

export type RideStatus =
  | 'REQUESTED'
  | 'DISPATCHING'
  | 'DRIVER_ACCEPTED'
  | 'EN_ROUTE_PICKUP'
  | 'ARRIVED_PICKUP'
  | 'PET_ONBOARD'
  | 'EN_ROUTE_DROPOFF'
  | 'COMPLETED'
  | 'CANCELLED_BY_TUTOR'
  | 'CANCELLED_BY_DRIVER'
  | 'CANCELLED_BY_SYSTEM';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  size: PetSize;
  weight: number;
  temperament: string;
  crateRequired: boolean;
  vaccinesUpToDate: boolean;
  needs?: string;
  notes?: string;
  photoUrl?: string;
}

export type DriverApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'INACTIVE';

export interface Driver {
  id: string;
  name: string;
  rating: number;
  completedRuns: number;
  equipments: string[];
  status: 'ONLINE' | 'OFFLINE' | 'ON_TRIP';
  vehicle: {
    model: string;
    plate: string;
    category: RideCategory[];
  };
  etaMinutes?: number;
  email?: string;
  phone?: string;
  cnhNumber?: string;
  cnhExpiresAt?: string;
  cnhDocumentUrl?: string;
  profilePhotoUrl?: string;
  applicationStatus?: DriverApplicationStatus;
  applicationNotes?: string;
  applicationHistory?: string[];
  vehicleYear?: number;
  categories?: RideCategory[];
  trainingCompletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RideEvent {
  id: string;
  status: RideStatus;
  title: string;
  description: string;
  at: string;
}

export interface Ride {
  id: string;
  tutorName: string;
  pet: Pet;
  category: RideCategory;
  status: RideStatus;
  pickupAddress: string;
  destinationAddress: string;
  scheduledAt: string;
  estimatedDistanceKm: number;
  estimatedDurationMin: number;
  price: number;
  driver?: Driver;
  notes?: string;
  lastUpdate: string;
  timeline: RideEvent[];
}

export interface Incident {
  id: string;
  rideId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'triaged' | 'resolved';
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  rideId?: string;
  subject: string;
  summary: string;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'in_progress' | 'done';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  rideId: string;
  senderRole: 'tutor' | 'driver' | 'support';
  content: string;
  at: string;
}

export interface DashboardSnapshot {
  pets: Pet[];
  drivers: Driver[];
  rides: Ride[];
  incidents: Incident[];
  tickets: SupportTicket[];
  messages: ChatMessage[];
}
