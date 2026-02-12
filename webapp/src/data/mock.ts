import { addMinutes, subMinutes } from "date-fns";
import type { ChatMessage, Driver, Incident, Pet, PricingRule, Ride, RideCategory, SupportTicket } from "../types";

export const pets: Pet[] = [
  {
    id: "pet_1",
    name: "Luna",
    species: "CAT",
    size: "SMALL",
    weight: 4.2,
    temperament: "calma",
    crateRequired: true,
    vaccinesUpToDate: true,
    notes: "Prefere cobertor fechado",
  },
  {
    id: "pet_2",
    name: "Thor",
    species: "DOG",
    size: "LARGE",
    weight: 36,
    temperament: "sociável",
    crateRequired: false,
    vaccinesUpToDate: true,
    needs: "Cinto peitoral para porte grande",
  },
  {
    id: "pet_3",
    name: "Frida",
    species: "DOG",
    size: "MEDIUM",
    weight: 18,
    temperament: "ansiosa com estranhos",
    crateRequired: true,
    vaccinesUpToDate: false,
    notes: "Medicação às 11h",
  },
];

export const animalsPerCategory: Record<RideCategory, string> = {
  BASIC: "1 pet até 20 kg / caixa obrigatória opcional",
  PLUS: "Até 35 kg ou 2 pets pequenos",
  SUV: "1 pet grande >35 kg ou 2 médios",
  VET: "Pets pós-cirúrgicos com manta térmica e prioridade",
};

export const drivers: Driver[] = [
  {
    id: "drv_1",
    name: "Camila Duarte",
    rating: 4.94,
    completedRuns: 1268,
    equipments: ["Caixa universal", "Cinto pet M/G", "Spray enzimático", "Manta térmica"],
    status: "ONLINE",
    vehicle: {
      model: "Doblò Adventure 2022",
      plate: "FHP2B19",
      category: ["PLUS", "VET", "SUV"],
    },
    etaMinutes: 8,
  },
  {
    id: "drv_2",
    name: "Rafael Nunes",
    rating: 4.81,
    completedRuns: 842,
    equipments: ["Cinto pet P", "Forro impermeável", "Kit limpeza"],
    status: "ON_TRIP",
    vehicle: {
      model: "Spin LTZ 2021",
      plate: "GVX3F12",
      category: ["BASIC", "PLUS"],
    },
    etaMinutes: 4,
  },
  {
    id: "drv_3",
    name: "Juliana Prado",
    rating: 4.99,
    completedRuns: 1930,
    equipments: ["Rampas pets idosos", "Manta térmica Vet", "Monitor de temperatura"],
    status: "ONLINE",
    vehicle: {
      model: "Renegade 2023",
      plate: "GZF8A88",
      category: ["SUV", "VET"],
    },
    etaMinutes: 11,
  },
];

export const pricingRules: PricingRule[] = [
  {
    id: "sp",
    city: "São Paulo",
    baseFare: 12,
    perKm: 4.2,
    perMin: 0.75,
    surgeCap: 1.8,
    petSizeMultiplier: {
      SMALL: 1,
      MEDIUM: 1.1,
      LARGE: 1.25,
    },
  },
  {
    id: "rj",
    city: "Rio de Janeiro",
    baseFare: 11,
    perKm: 4.0,
    perMin: 0.7,
    surgeCap: 1.6,
    petSizeMultiplier: {
      SMALL: 1,
      MEDIUM: 1.15,
      LARGE: 1.3,
    },
  },
];

const now = new Date();

export const rides: Ride[] = [
  {
    id: "ride_1",
    tutorName: "Marina Costa",
    pet: pets[0],
    category: "BASIC",
    status: "EN_ROUTE_PICKUP",
    pickupAddress: "R. Mourato Coelho, 1040 - Pinheiros",
    destinationAddress: "Vet Vida, Av. Rebouças 2225",
    scheduledAt: addMinutes(now, 15),
    estimatedDistanceKm: 5.4,
    estimatedDurationMin: 18,
    price: 58.9,
    driver: drivers[0],
    notes: "Levar caixa pink na mala",
    lastUpdate: now,
    timeline: [
      {
        id: "evt_1",
        status: "REQUESTED",
        title: "Corrida solicitada",
        description: "Tutor confirmou quote com cartão e Pix backup.",
        at: subMinutes(now, 20),
      },
      {
        id: "evt_2",
        status: "DRIVER_ACCEPTED",
        title: "Camila aceitou",
        description: "Motorista confirmou equipamentos Vet.",
        at: subMinutes(now, 10),
      },
      {
        id: "evt_3",
        status: "EN_ROUTE_PICKUP",
        title: "A caminho do tutor",
        description: "Checklist completado e foto do porta-malas enviada.",
        at: subMinutes(now, 2),
      },
    ],
  },
  {
    id: "ride_2",
    tutorName: "Clínica Bichos",
    pet: pets[1],
    category: "SUV",
    status: "PET_ONBOARD",
    pickupAddress: "Avenida Paulista, 2200",
    destinationAddress: "Hospital Vet Dr. Pet - Moema",
    scheduledAt: addMinutes(now, 45),
    estimatedDistanceKm: 9.1,
    estimatedDurationMin: 25,
    price: 112.0,
    driver: drivers[2],
    notes: "Pet com pós-cirúrgico, evitar frenagens bruscas.",
    lastUpdate: subMinutes(now, 5),
    timeline: [
      {
        id: "evt_4",
        status: "REQUESTED",
        title: "Agendamento Vet Prioritário",
        description: "Checklist pós-operatório anexado.",
        at: subMinutes(now, 40),
      },
      {
        id: "evt_5",
        status: "ARRIVED_PICKUP",
        title: "Motorista chegou",
        description: "Registro com foto e confirmação de focinheira.",
        at: subMinutes(now, 12),
      },
      {
        id: "evt_6",
        status: "PET_ONBOARD",
        title: "Thor embarcou",
        description: "Foto do pet com manta térmica enviada ao tutor.",
        at: subMinutes(now, 5),
      },
    ],
  },
];

export const incidents: Incident[] = [
  {
    id: "inc_1",
    rideId: "ride_1",
    title: "Alarme SOS tutor",
    description: "Tutor solicitou contato proativo após pet ficar agitado.",
    severity: "medium",
    status: "triaged",
    createdAt: subMinutes(now, 7),
  },
  {
    id: "inc_2",
    rideId: "ride_2",
    title: "Checklist incompleto",
    description: "Foto do cinto grande ainda não anexada.",
    severity: "low",
    status: "open",
    createdAt: subMinutes(now, 15),
  },
];

export const tickets: SupportTicket[] = [
  {
    id: "ticket_1",
    rideId: "ride_3",
    subject: "Cobrança de no-show",
    summary: "Tutor contesta taxa após motorista cancelar antes do SLA.",
    priority: "medium",
    status: "in_progress",
    createdAt: subMinutes(now, 35),
  },
  {
    id: "ticket_2",
    rideId: "ride_1",
    subject: "Atualizar cupom corporativo",
    summary: "Clínica UAU quer ampliar carteira com 5 tutores adicionais.",
    priority: "low",
    status: "new",
    createdAt: subMinutes(now, 60),
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: "msg_1",
    rideId: "ride_1",
    senderRole: "tutor",
    content: "Camila, Luna precisa ir dentro da caixa — está no hall.",
    at: subMinutes(now, 6),
  },
  {
    id: "msg_2",
    rideId: "ride_1",
    senderRole: "driver",
    content: "Perfeito! Em 5 min estou aí. Spray enzimático pronto.",
    at: subMinutes(now, 5),
  },
  {
    id: "msg_3",
    rideId: "ride_1",
    senderRole: "tutor",
    content: "Obrigada por mandar foto quando embarcar ❤️",
    at: subMinutes(now, 4),
  },
  {
    id: "msg_4",
    rideId: "ride_1",
    senderRole: "driver",
    content: "Foto enviada pelo app, Luna tranquila!",
    at: subMinutes(now, 2),
  },
];
