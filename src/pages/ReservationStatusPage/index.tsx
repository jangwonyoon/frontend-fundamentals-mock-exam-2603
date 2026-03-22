import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Top, Spacing, Border, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { useRooms } from 'hooks/useRooms';
import { useReservations } from 'hooks/useReservations';
import { useMyReservations } from 'hooks/useMyReservations';
import { formatDate } from 'shared/utils';
import { DatePicker } from 'components/DatePicker';
import { Timeline } from 'components/Timeline';
import { MyReservations } from 'components/MyReservations';
import { MessageBanner } from 'components/MessageBanner';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [date, setDate] = useState(formatDate(new Date()));

  const locationState: unknown = location.state;
  const initialMessage =
    locationState != null &&
    typeof locationState === 'object' &&
    'message' in locationState &&
    typeof (locationState as Record<string, unknown>).message === 'string'
      ? (locationState as Record<string, unknown>).message as string
      : null;
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    initialMessage ? { type: 'success', text: initialMessage } : null
  );

  useEffect(() => {
    if (initialMessage) {
      window.history.replaceState({}, '');
    }
  }, [initialMessage]);

  const { data: rooms = [] } = useRooms();
  const { data: reservations = [] } = useReservations(date);
  const { myReservations: myReservationList, cancel } = useMyReservations();

  const handleCancel = async (id: string) => {
    try {
      await cancel(id);
      setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
    } catch {
      setMessage({ type: 'error', text: '취소에 실패했습니다.' });
    }
  };

  return (
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
        회의실 예약
      </Top.Top03>

      <Spacing size={24} />

      {/* 날짜 선택 */}
      <div css={css`padding: 0 24px;`}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          날짜 선택
        </Text>
        <Spacing size={16} />
        <DatePicker value={date} onChange={setDate} />
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 현황 타임라인 */}
      <div css={css`padding: 0 24px;`}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 현황
        </Text>
        <Spacing size={16} />
        <Timeline rooms={rooms} reservations={reservations} />
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 메시지 배너 */}
      {message && <MessageBanner type={message.type} text={message.text} />}

      {/* 내 예약 목록 */}
      <MyReservations
        reservations={myReservationList}
        rooms={rooms}
        onCancel={handleCancel}
      />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약하기 버튼 */}
      <div css={css`padding: 0 24px;`}>
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}
