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

  const hasTimeInputs = startTime !== '' && endTime !== '';
  const today = formatDate(new Date());

  const validationRules = [
    { test: date < today, message: '과거 날짜에는 예약할 수 없습니다.' },
    { test: endTime <= startTime, message: '종료 시간은 시작 시간보다 늦어야 합니다.' },
    { test: attendees < 1, message: '참석 인원은 1명 이상이어야 합니다.' },
    { test: attendees > MAX_ATTENDEES, message: `참석 인원은 최대 ${MAX_ATTENDEES}명까지 가능합니다.` },
  ];

  const validationError = hasTimeInputs
    ? validationRules.find(r => r.test)?.message ?? null
    : null;
  const isFilterComplete = hasTimeInputs && !validationError;

  const withReset = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value);
    resetSelection();
  };

  const filterProps = {
    date,
    startTime,
    endTime,
    attendees,
    equipment,
    preferredFloor,
    onDateChange: withReset(setDate),
    onStartTimeChange: withReset(setStartTime),
    onEndTimeChange: withReset(setEndTime),
    onAttendeesChange: withReset(setAttendees),
    onEquipmentChange: withReset(setEquipment),
    onPreferredFloorChange: withReset(setPreferredFloor),
  };

  return {
    filterProps,
    date, startTime, endTime, attendees, equipment, preferredFloor,
    selectedRoomId, setSelectedRoomId,
    errorMessage, setErrorMessage,
    validationError,
    isFilterComplete,
    resetSelection,
  };
}
