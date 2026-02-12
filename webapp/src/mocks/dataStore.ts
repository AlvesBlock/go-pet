import type { ChatMessage, CreateRidePayload, Incident, Ride } from "../types";
import {
  chatMessages as seedMessages,
  drivers as seedDrivers,
  incidents as seedIncidents,
  pets as seedPets,
  rides as seedRides,
  tickets as seedTickets,
} from "../data/mock";
import { generateId } from "../utils/formatters";

export const db = {
  pets: [...seedPets],
  drivers: [...seedDrivers],
  rides: [...seedRides],
  incidents: [...seedIncidents],
  tickets: [...seedTickets],
  messages: [...seedMessages],
};

export function buildDashboardPayload() {
  return {
    pets: db.pets,
    drivers: db.drivers,
    rides: db.rides,
    incidents: db.incidents,
    tickets: db.tickets,
    messages: db.messages,
  };
}

export function createRide(payload: CreateRidePayload): Ride {
  const pet = db.pets.find((item) => item.id === payload.petId) ?? db.pets[0];
  const driver = db.drivers.find((candidate) => candidate.status === "ONLINE");

  const ride: Ride = {
    id: generateId("ride"),
    tutorName: payload.tutorName,
    pet,
    category: payload.category,
    status: "REQUESTED",
    pickupAddress: payload.pickupAddress,
    destinationAddress: payload.destinationAddress,
    scheduledAt: payload.scheduledAt,
    estimatedDistanceKm: 5.7,
    estimatedDurationMin: 16,
    price: 58.9,
    driver,
    notes: payload.notes,
    lastUpdate: new Date(),
    timeline: [
      {
        id: generateId("evt"),
        status: "REQUESTED",
        title: "Solicitação registrada",
        description: "Quote gerado e pré-autorizado.",
        at: new Date(),
      },
    ],
  };

  db.rides = [ride, ...db.rides];
  return ride;
}

export function addChatMessage(message: Omit<ChatMessage, "id" | "at">): ChatMessage {
  const record: ChatMessage = {
    ...message,
    id: generateId("msg"),
    at: new Date(),
  };
  db.messages = [...db.messages, record];
  return record;
}

export function addIncident(incident: Omit<Incident, "id" | "createdAt">): Incident {
  const record: Incident = {
    ...incident,
    id: generateId("inc"),
    createdAt: new Date(),
  };
  db.incidents = [record, ...db.incidents];
  return record;
}
