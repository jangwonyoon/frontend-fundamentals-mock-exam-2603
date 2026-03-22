import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Border } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import axios from 'axios';
import { useErrorBoundary } from 'react-error-boundary';
import { useRooms } from 'hooks/useRooms';
import { useReservations } from 'hooks/useReservations';
import { useCreateReservation } from 'hooks/useCreateReservation';
import { useBookingFilter } from 'hooks/useBookingFilter';
import { FilterPanel } from 'components/FilterPanel';
import { AvailableRoomList } from 'components/AvailableRoomList';
import { MessageBanner } from 'components/MessageBanner';
import { filterAvailableRooms } from 'shared/utils';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();

  const {
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
  } = useBookingFilter();

  const { data: rooms = [] } = useRooms();
  const { data: reservations = [] } = useReservations(date);
  const createMutation = useCreateReservation();

  const floors = [...new Set(rooms.map(r => r.floor))].sort((a, b) => a - b);

  const availableRooms = isFilterComplete
    ? filterAvailableRooms(rooms, reservations, {
        date, startTime, endTime, attendees, equipment, preferredFloor,
      })
    : [];

  const handleBook = async () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!startTime || !endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date,
        start: startTime,
        end: endTime,
        attendees,
        equipment,
      });

      if (result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      setErrorMessage(result.message ?? '예약에 실패했습니다.');
      setSelectedRoomId(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data != null) {
        const data: unknown = err.response.data;
        let serverMessage = '예약에 실패했습니다.';
        if (typeof data === 'object' && data !== null && 'message' in data) {
          const msg = (data as Record<string, unknown>).message;
          if (typeof msg === 'string') {
            serverMessage = msg;
          }
        }
        setErrorMessage(serverMessage);
        setSelectedRoomId(null);
        return;
      }
      showBoundary(err);
    }
  };

  const handleFilterField = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value);
    resetSelection();
  };

  return (
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <div css={css`padding: 12px 24px 0;`}>
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="뒤로가기"
          css={css`
            background: none; border: none; padding: 0; cursor: pointer; font-size: 14px;
            color: ${colors.grey600}; &:hover { color: ${colors.grey900}; }
          `}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
        예약하기
      </Top.Top03>

      {errorMessage && (
        <>
          <Spacing size={12} />
          <MessageBanner type="error" text={errorMessage} />
        </>
      )}

      <Spacing size={24} />

      <FilterPanel
        date={date}
        startTime={startTime}
        endTime={endTime}
        attendees={attendees}
        equipment={equipment}
        preferredFloor={preferredFloor}
        floors={floors}
        validationError={validationError}
        onDateChange={handleFilterField(setDate)}
        onStartTimeChange={handleFilterField(setStartTime)}
        onEndTimeChange={handleFilterField(setEndTime)}
        onAttendeesChange={handleFilterField(setAttendees)}
        onEquipmentChange={handleFilterField(setEquipment)}
        onPreferredFloorChange={handleFilterField(setPreferredFloor)}
      />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {isFilterComplete && (
        <AvailableRoomList
          rooms={availableRooms}
          selectedRoomId={selectedRoomId}
          isLoading={createMutation.isLoading}
          onSelectRoom={setSelectedRoomId}
          onBook={handleBook}
        />
      )}

      <Spacing size={24} />
    </div>
  );
}
