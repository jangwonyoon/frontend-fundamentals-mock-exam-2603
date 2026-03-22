import { TIMELINE_START } from './constants';
import type { Room, Reservation, Equipment } from './types';

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h - TIMELINE_START) * 60 + m;
}

interface RoomFilterCriteria {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: Equipment[];
  preferredFloor: number | null;
}

export function filterAvailableRooms(
  rooms: Room[],
  reservations: Reservation[],
  criteria: RoomFilterCriteria,
): Room[] {
  const { date, startTime, endTime, attendees, equipment, preferredFloor } = criteria;

  return rooms
    .filter((room) => {
      if (room.capacity < attendees) return false;
      if (!equipment.every(eq => room.equipment.includes(eq))) return false;
      if (preferredFloor !== null && room.floor !== preferredFloor) return false;
      const hasConflict = reservations.some(
        (r) => r.roomId === room.id && r.date === date && r.start < endTime && r.end > startTime,
      );
      return !hasConflict;
    })
    .sort((a, b) => {
      if (a.floor !== b.floor) return a.floor - b.floor;
      return a.name.localeCompare(b.name);
    });
}
