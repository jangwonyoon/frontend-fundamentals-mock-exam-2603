import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatDate } from 'shared/utils';
import { ALL_EQUIPMENT, MAX_ATTENDEES } from 'shared/constants';
import type { Equipment } from 'shared/types';

const VALID_EQUIPMENT = new Set<string>(ALL_EQUIPMENT);

export function useBookingFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [date, setDate] = useState(searchParams.get('date') || formatDate(new Date()));
  const [startTime, setStartTime] = useState(searchParams.get('startTime') || '');
  const [endTime, setEndTime] = useState(searchParams.get('endTime') || '');
  const [attendees, setAttendees] = useState(Number(searchParams.get('attendees')) || 1);
  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    const raw = searchParams.get('equipment');
    if (!raw) return [];
    return raw.split(',').filter((v): v is Equipment => VALID_EQUIPMENT.has(v));
  });
  const [preferredFloor, setPreferredFloor] = useState<number | null>(
    searchParams.get('floor') ? Number(searchParams.get('floor')) : null
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (date) params.date = date;
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;
    if (attendees > 1) params.attendees = String(attendees);
    if (equipment.length > 0) params.equipment = equipment.join(',');
    if (preferredFloor !== null) params.floor = String(preferredFloor);
    setSearchParams(params, { replace: true });
  }, [date, startTime, endTime, attendees, equipment, preferredFloor, setSearchParams]);

  const resetSelection = () => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  let validationError: string | null = null;
  const hasTimeInputs = startTime !== '' && endTime !== '';
  if (hasTimeInputs) {
    const today = formatDate(new Date());

    if (date < today) {
      validationError = '과거 날짜에는 예약할 수 없습니다.';
    } else if (endTime <= startTime) {
      validationError = '종료 시간은 시작 시간보다 늦어야 합니다.';
    } else if (attendees < 1) {
      validationError = '참석 인원은 1명 이상이어야 합니다.';
    } else if (attendees > MAX_ATTENDEES) {
      validationError = `참석 인원은 최대 ${MAX_ATTENDEES}명까지 가능합니다.`;
    }
  }
  const isFilterComplete = hasTimeInputs && !validationError;

  return {
    date, setDate,
    startTime, setStartTime,
    endTime, setEndTime,
    attendees, setAttendees,
    equipment, setEquipment,
    preferredFloor, setPreferredFloor,
    selectedRoomId, setSelectedRoomId,
    errorMessage, setErrorMessage,
    validationError,
    isFilterComplete,
    resetSelection,
  };
}
