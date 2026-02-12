import type {
  ChatMessage,
  CreateDriverPayload,
  CreateRidePayload,
  Driver,
  Incident,
  Pet,
  Ride,
  SupportTicket,
} from "../types";
import {
  chatMessages as fallbackMessages,
  drivers as fallbackDrivers,
  incidents as fallbackIncidents,
  pets as fallbackPets,
  rides as fallbackRides,
  tickets as fallbackTickets,
} from "../data/mock";
import { generateId } from "../utils/formatters";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const API_ROOT = API_BASE_URL.replace(/\/api$/, "");

interface InitialDataPayload {
  pets: Pet[];
  drivers: Driver[];
  rides: Ride[];
  incidents: Incident[];
  tickets: SupportTicket[];
  messages: ChatMessage[];
}

const fallbackPayload: InitialDataPayload = {
  pets: fallbackPets,
  drivers: fallbackDrivers,
  rides: fallbackRides,
  incidents: fallbackIncidents,
  tickets: fallbackTickets,
  messages: fallbackMessages,
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro na API (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function fetchInitialData(): Promise<InitialDataPayload> {
  if (!API_BASE_URL) {
    return fallbackPayload;
  }

  try {
    return await request<InitialDataPayload>("/dashboard");
  } catch (error) {
    console.warn("Falha ao buscar API, usando mocks locais.", error);
    return fallbackPayload;
  }
}

function buildLocalRide(payload: CreateRidePayload, pet: Pet, driver?: Driver): Ride {
  return {
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
        title: "SolicitaÃ§Ã£o registrada",
        description: "Quote gerado e prÃ©-autorizado.",
        at: new Date(),
      },
    ],
  };
}

export async function apiCreateRide(payload: CreateRidePayload, pet: Pet, driver?: Driver): Promise<Ride> {
  if (!pet) {
    throw new Error("Pet nÃ£o encontrado");
  }

  if (API_BASE_URL) {
    try {
      return await request<Ride>("/rides", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.warn("Falha ao criar corrida na API, usando fallback local.", error);
    }
  }

  return buildLocalRide(payload, pet, driver);
}

export async function apiSendChatMessage(
  rideId: string,
  senderRole: ChatMessage["senderRole"],
  content: string,
): Promise<ChatMessage> {
  if (API_BASE_URL) {
    try {
      return await request<ChatMessage>(`/rides/${rideId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content, senderRole }),
      });
    } catch (error) {
      console.warn("Falha ao enviar mensagem para API, usando fallback local.", error);
    }
  }

  return {
    id: generateId("msg"),
    rideId,
    senderRole,
    content,
    at: new Date(),
  };
}

export async function apiLogIncident(incident: Omit<Incident, "id" | "createdAt">): Promise<Incident> {
  if (API_BASE_URL) {
    try {
      return await request<Incident>("/incidents", {
        method: "POST",
        body: JSON.stringify(incident),
      });
    } catch (error) {
      console.warn("Falha ao registrar incidente na API, usando fallback local.", error);
    }
  }

  return {
    ...incident,
    id: generateId("inc"),
    createdAt: new Date(),
  };
}

export async function apiCreateDriver(payload: CreateDriverPayload): Promise<Driver> {
  if (API_BASE_URL) {
    try {
      return await request<Driver>("/drivers", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.warn("Falha ao criar motorista na API, usando fallback local.", error);
    }
  }

  return {
    id: generateId("drv"),
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    rating: 5,
    completedRuns: 0,
    equipments: payload.equipments,
    status: "OFFLINE",
    applicationStatus: "PENDING",
    cnhNumber: payload.cnhNumber,
    cnhExpiresAt: payload.cnhExpiresAt,
    vehicleYear: Number(payload.vehicle.year),
    categories: payload.categories,
    trainingCompletedAt: payload.trainingCompletedAt ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vehicle: {
      model: payload.vehicle.model,
      plate: payload.vehicle.plate,
      category: payload.categories,
    },
  };
}

export async function apiUpdateDriverStatus(id: string, status: Driver["applicationStatus"], notes?: string): Promise<Driver> {
  if (API_BASE_URL) {
    try {
      return await request<Driver>(`/drivers/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, notes }),
      });
    } catch (error) {
      console.warn("Falha ao atualizar status da API, ajustando apenas localmente.", error);
    }
  }

  return {
    id,
    name: "",
    rating: 5,
    completedRuns: 0,
    equipments: [],
    status: "OFFLINE",
    applicationStatus: status,
    applicationHistory: [],
    vehicle: { model: "", plate: "", category: [] },
  };
}

export async function apiUpload(file: File): Promise<string> {
  if (!file) {
    throw new Error("Arquivo invalido");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE_URL}/uploads`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Nao foi possivel enviar o arquivo");
    }

    const data = (await response.json()) as { url: string };
    const url = data.url ?? "";
    return url.startsWith("http") ? url : `${API_ROOT}${url}`;
  } catch (error) {
    console.warn("Upload na API falhou, usando URL local.", error);
    return URL.createObjectURL(file);
  }
}

export type { InitialDataPayload };

