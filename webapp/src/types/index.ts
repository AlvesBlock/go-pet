export type Species = "DOG" | "CAT";
export type PetSize = "SMALL" | "MEDIUM" | "LARGE";
export type RideCategory = "BASIC" | "PLUS" | "SUV" | "VET";

export type RideStatus =
  | "REQUESTED"
  | "DISPATCHING"
  | "DRIVER_ACCEPTED"
  | "EN_ROUTE_PICKUP"
  | "ARRIVED_PICKUP"
  | "PET_ONBOARD"
  | "EN_ROUTE_DROPOFF"
  | "COMPLETED"
  | "CANCELLED_BY_TUTOR"
  | "CANCELLED_BY_DRIVER"
  | "CANCELLED_BY_SYSTEM";

export interface Pet {
  id: string;
  name: string;
  species: Species;
  size: PetSize;
  weight: number;
  temperament: string;
  needs?: string;
  crateRequired: boolean;
  vaccinesUpToDate: boolean;
  notes?: string;
  photoUrl?: string;
}

export interface Driver {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  rating: number;
  completedRuns: number;
  equipments: string[];
  status: "ONLINE" | "OFFLINE" | "ON_TRIP";
  applicationStatus?: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" | "INACTIVE";
  cnhNumber?: string;
  cnhExpiresAt?: string;
  cnhDocumentUrl?: string;
  profilePhotoUrl?: string;
  vehicleYear?: number;
  categories?: RideCategory[];
  trainingCompletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  applicationNotes?: string;
  applicationHistory?: string[];
  vehicle: {
    model: string;
    plate: string;
    category: RideCategory[];
  };
  etaMinutes?: number;
}

export interface CreateDriverPayload {
  name: string;
  email: string;
  phone?: string;
  cnhNumber: string;
  cnhExpiresAt: string;
  vehicle: {
    model: string;
    plate: string;
    year: string;
  };
  categories: RideCategory[];
  equipments: string[];
  trainingCompletedAt?: string;
  cnhDocumentUrl?: string;
  profilePhotoUrl?: string;
}

export interface RideEvent {
  id: string;
  status: RideStatus;
  title: string;
  description: string;
  at: Date;
}

export interface Ride {
  id: string;
  tutorName: string;
  pet: Pet;
  category: RideCategory;
  status: RideStatus;
  pickupAddress: string;
  destinationAddress: string;
  scheduledAt: Date;
  estimatedDistanceKm: number;
  estimatedDurationMin: number;
  price: number;
  driver?: Driver;
  timeline: RideEvent[];
  notes?: string;
  lastUpdate: Date;
}

export interface Incident {
  id: string;
  rideId: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  status: "open" | "triaged" | "resolved";
  createdAt: Date;
}

export interface SupportTicket {
  id: string;
  rideId?: string;
  subject: string;
  summary: string;
  priority: "low" | "medium" | "high";
  status: "new" | "in_progress" | "done";
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  rideId: string;
  senderRole: "tutor" | "driver" | "support";
  content: string;
  at: Date;
}

export interface PricingRule {
  id: string;
  city: string;
  baseFare: number;
  perKm: number;
  perMin: number;
  surgeCap: number;
  petSizeMultiplier: Record<PetSize, number>;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  expiresAt: Date;
}

export interface CreateRidePayload {
  tutorName: string;
  petId: string;
  category: RideCategory;
  pickupAddress: string;
  destinationAddress: string;
  scheduledAt: Date;
  notes?: string;
}
