import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ChatMessage, DashboardSnapshot, Incident, Ride } from '../domain/types';
import { incidents, messages, pets, rides, tickets } from './seed';
import { CreateRideDto } from '../rides/dto/create-ride.dto';
import { CreateMessageDto } from '../rides/dto/create-message.dto';
import { CreateIncidentDto } from '../incidents/dto/create-incident.dto';
import { DriverRepository } from '../drivers/repositories/driver.repository';

@Injectable()
export class DataStoreService {
  private pets = [...pets];
  private rides = [...rides];
  private incidents = [...incidents];
  private tickets = [...tickets];
  private messages = [...messages];

  constructor(private readonly driverRepository: DriverRepository) {}

  async getSnapshot(): Promise<DashboardSnapshot> {
    const drivers = await this.driverRepository.findAll();
    return {
      pets: this.pets,
      drivers,
      rides: this.rides,
      incidents: this.incidents,
      tickets: this.tickets,
      messages: this.messages,
    };
  }

  async createRide(payload: CreateRideDto): Promise<Ride> {
    const pet = this.pets.find((item) => item.id === payload.petId);
    if (!pet) {
      throw new Error('Pet not found');
    }

    const drivers = await this.driverRepository.findAll();
    const driver = drivers.find((item) => item.status === 'ONLINE');

    const ride: Ride = {
      id: `ride_${randomUUID().slice(0, 8)}`,
      tutorName: payload.tutorName,
      pet,
      category: payload.category,
      status: 'REQUESTED',
      pickupAddress: payload.pickupAddress,
      destinationAddress: payload.destinationAddress,
      scheduledAt: new Date(payload.scheduledAt).toISOString(),
      estimatedDistanceKm: 5.7,
      estimatedDurationMin: 16,
      price: 58.9,
      driver,
      notes: payload.notes,
      lastUpdate: new Date().toISOString(),
      timeline: [
        {
          id: `evt_${randomUUID().slice(0, 8)}`,
          status: 'REQUESTED',
          title: 'Solicitação registrada',
          description: 'Quote gerado e pré-autorizado.',
          at: new Date().toISOString(),
        },
      ],
    };

    this.rides = [ride, ...this.rides];
    return ride;
  }

  addMessage(rideId: string, payload: CreateMessageDto): ChatMessage {
    const rideExists = this.rides.some((ride) => ride.id === rideId);
    if (!rideExists) {
      throw new Error('Ride not found');
    }

    const message: ChatMessage = {
      id: `msg_${randomUUID().slice(0, 8)}`,
      rideId,
      senderRole: payload.senderRole,
      content: payload.content,
      at: new Date().toISOString(),
    };

    this.messages = [...this.messages, message];
    return message;
  }

  createIncident(payload: CreateIncidentDto): Incident {
    const incident: Incident = {
      id: `inc_${randomUUID().slice(0, 8)}`,
      rideId: payload.rideId,
      title: payload.title,
      description: payload.description,
      severity: payload.severity,
      status: payload.status,
      createdAt: new Date().toISOString(),
    };

    this.incidents = [incident, ...this.incidents];
    return incident;
  }
}
