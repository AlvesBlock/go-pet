import { create } from "zustand";
import type {
  ChatMessage,
  CreateDriverPayload,
  CreateRidePayload,
  Driver,
  Incident,
  Pet,
  Ride,
  RideStatus,
  SupportTicket,
} from "../types";
import { generateId } from "../utils/formatters";
import {
  apiCreateDriver,
  apiCreateRide,
  apiLogIncident,
  apiSendChatMessage,
  apiUpdateDriverStatus,
  fetchInitialData,
} from "../services/gopetApi";

const lifecycleFlow: RideStatus[] = [
  "REQUESTED",
  "DISPATCHING",
  "DRIVER_ACCEPTED",
  "EN_ROUTE_PICKUP",
  "ARRIVED_PICKUP",
  "PET_ONBOARD",
  "EN_ROUTE_DROPOFF",
  "COMPLETED",
];

interface AppState {
  pets: Pet[];
  drivers: Driver[];
  rides: Ride[];
  incidents: Incident[];
  tickets: SupportTicket[];
  messages: ChatMessage[];
  loading: boolean;
  hydrated: boolean;
  error?: string;
  loadInitialData: () => Promise<void>;
  createRide: (payload: CreateRidePayload) => Promise<Ride>;
  createDriver: (payload: CreateDriverPayload) => Promise<Driver>;
  updateDriverStatus: (driverId: string, status: Driver["applicationStatus"], notes?: string) => Promise<void>;
  updateRideStatus: (rideId: string, status: RideStatus, description?: string) => void;
  sendChatMessage: (rideId: string, senderRole: ChatMessage["senderRole"], content: string) => Promise<void>;
  logIncident: (incident: Omit<Incident, "id" | "createdAt">) => Promise<void>;
  resolveTicket: (ticketId: string, status: SupportTicket["status"]) => void;
  simulateRideLifecycle: (rideId: string) => void;
}

const initialState: Pick<
  AppState,
  "pets" | "drivers" | "rides" | "incidents" | "tickets" | "messages" | "loading" | "hydrated"
> = {
  pets: [],
  drivers: [],
  rides: [],
  incidents: [],
  tickets: [],
  messages: [],
  loading: false,
  hydrated: false,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,
  loadInitialData: async () => {
    if (get().loading) return;
    set({ loading: true, error: undefined });
    try {
      const data = await fetchInitialData();
      set({
        ...data,
        loading: false,
        hydrated: true,
        error: undefined,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Erro ao carregar dados",
      });
    }
  },
  createDriver: async (payload) => {
    const driver = await apiCreateDriver(payload);
    set((state) => ({
      drivers: [driver, ...state.drivers],
    }));
    return driver;
  },
  updateDriverStatus: async (driverId, status, notes) => {
    const driver = await apiUpdateDriverStatus(driverId, status, notes);
    set((state) => ({
      drivers: state.drivers.map((item) =>
        item.id === driver.id ? { ...item, ...driver, applicationStatus: status, applicationNotes: notes } : item,
      ),
    }));
  },
  createRide: async (payload) => {
    const pet = get().pets.find((p) => p.id === payload.petId);
    if (!pet) {
      throw new Error("Pet não encontrado");
    }

    const driverCandidate = get().drivers.find((driver) => driver.status === "ONLINE");
    const ride = await apiCreateRide(payload, pet, driverCandidate);

    set((state) => ({
      rides: [ride, ...state.rides],
    }));

    return ride;
  },
  updateRideStatus: (rideId, status, description) =>
    set((state) => ({
      rides: state.rides.map((ride) => {
        if (ride.id !== rideId) return ride;
        return {
          ...ride,
          status,
          lastUpdate: new Date(),
          timeline: [
            ...ride.timeline,
            {
              id: generateId("evt"),
              status,
              title: `Status atualizado para ${status}`,
              description: description ?? "",
              at: new Date(),
            },
          ],
        };
      }),
    })),
  sendChatMessage: async (rideId, senderRole, content) => {
    const message = await apiSendChatMessage(rideId, senderRole, content);
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
  logIncident: async (incident) => {
    const record = await apiLogIncident(incident);
    set((state) => ({
      incidents: [record, ...state.incidents],
    }));
  },
  resolveTicket: (ticketId, status) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, status } : ticket)),
    })),
  simulateRideLifecycle: (rideId) => {
    const steps: RideStatus[] = ["DISPATCHING", "DRIVER_ACCEPTED", "EN_ROUTE_PICKUP", "PET_ONBOARD", "EN_ROUTE_DROPOFF", "COMPLETED"];
    steps.forEach((status, index) => {
      const delay = 2500 * (index + 1);
      setTimeout(() => {
        const ride = get().rides.find((r) => r.id === rideId);
        if (!ride) return;
        const nextIndex = lifecycleFlow.indexOf(ride.status);
        const targetIndex = lifecycleFlow.indexOf(status);
        if (targetIndex >= nextIndex) {
          get().updateRideStatus(
            rideId,
            status,
            status === "PET_ONBOARD" ? "Foto do pet enviada automaticamente." : undefined,
          );
        }
      }, delay);
    });
  },
}));
