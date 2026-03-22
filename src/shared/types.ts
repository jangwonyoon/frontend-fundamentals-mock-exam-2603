export type { Equipment, Room, Reservation } from '_tosslib/server/types';

import type { Equipment, Reservation } from '_tosslib/server/types';

export type CreateReservationRequest = {
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: Equipment[];
};

export type CreateReservationSuccess = {
  ok: true;
  reservation: Reservation;
};

export type CreateReservationError = {
  ok: false;
  code: 'CONFLICT' | 'INVALID' | 'NOT_FOUND';
  message: string;
};

export type CreateReservationResponse = CreateReservationSuccess | CreateReservationError;
