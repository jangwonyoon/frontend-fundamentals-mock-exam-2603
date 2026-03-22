export type Equipment = 'tv' | 'whiteboard' | 'video' | 'speaker';

export interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipment: Equipment[];
}

export interface Reservation {
  id: string;
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: Equipment[];
}

export interface CreateReservationRequest {
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: Equipment[];
}

export interface CreateReservationSuccess {
  ok: true;
  reservation: Reservation;
}

export interface CreateReservationError {
  ok: false;
  code: 'CONFLICT' | 'INVALID' | 'NOT_FOUND';
  message: string;
}

export type CreateReservationResponse = CreateReservationSuccess | CreateReservationError;
