import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';
import { MAX_BOOKING_DAYS_AHEAD } from 'shared/constants';
import { formatDate } from 'shared/utils';

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  showReset?: boolean;
};

export function DatePicker({ value, onChange, showReset = false }: DatePickerProps) {
  const today = formatDate(new Date());
  const maxDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + MAX_BOOKING_DAYS_AHEAD);
    return formatDate(d);
  })();
  const isNotToday = value !== today;

  return (
    <div css={css`display: flex; align-items: center; gap: 8px;`}>
      <input
        type="date"
        value={value}
        min={today}
        max={maxDate}
        onChange={e => onChange(e.target.value)}
        aria-label="날짜"
        css={css`
          box-sizing: border-box; font-size: 16px; font-weight: 500; line-height: 1.5; height: 48px;
          background-color: ${colors.grey50}; border-radius: 12px; color: ${colors.grey800};
          flex: 1; border: 1px solid ${colors.grey200}; padding: 0 16px; outline: none;
          cursor: pointer; transition: border-color 0.15s; &:focus { border-color: ${colors.blue500}; }
        `}
      />
      {showReset && isNotToday && (
        <button
          type="button"
          onClick={() => onChange(today)}
          aria-label="오늘 날짜로 초기화"
          css={css`
            flex-shrink: 0; width: 48px; height: 48px; border-radius: 12px;
            border: 1px solid ${colors.grey200}; background: ${colors.grey50};
            color: ${colors.grey600}; font-size: 12px; font-weight: 500;
            cursor: pointer; transition: all 0.15s;
            &:hover { border-color: ${colors.blue500}; color: ${colors.blue600}; background: ${colors.blue50}; }
          `}
        >
          오늘
        </button>
      )}
    </div>
  );
}
