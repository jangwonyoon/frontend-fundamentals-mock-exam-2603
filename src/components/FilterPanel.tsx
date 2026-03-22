import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { css } from '@emotion/react';
import { Spacing, Text, Select } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { EQUIPMENT_LABELS, ALL_EQUIPMENT, TIME_SLOTS, MAX_ATTENDEES } from 'shared/constants';
import type { Equipment } from 'shared/types';
import { DatePicker } from './DatePicker';

type FilterValues = {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: Equipment[];
  preferredFloor: number | null;
};

type FilterHandlers = {
  onDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onAttendeesChange: (value: number) => void;
  onEquipmentChange: (value: Equipment[]) => void;
  onPreferredFloorChange: (value: number | null) => void;
};

type FilterContext = FilterValues & FilterHandlers;

const FilterPanelContext = createContext<FilterContext | null>(null);

function useFilterPanel() {
  const ctx = useContext(FilterPanelContext);
  if (!ctx) throw new Error('FilterPanel 서브 컴포넌트는 FilterPanel 내부에서 사용해야 합니다.');
  return ctx;
}

type FilterPanelProps = FilterContext & {
  children: ReactNode;
};

function DateField() {
  const { date, onDateChange } = useFilterPanel();
  return (
    <div css={css`display: flex; flex-direction: column; gap: 6px;`}>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>날짜</Text>
      <DatePicker value={date} onChange={onDateChange} showReset />
    </div>
  );
}

function TimeFields() {
  const { startTime, endTime, onStartTimeChange, onEndTimeChange } = useFilterPanel();
  return (
    <div css={css`display: flex; gap: 12px;`}>
      <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>시작 시간</Text>
        <Select
          value={startTime}
          onChange={e => onStartTimeChange(e.target.value)}
          aria-label="시작 시간"
        >
          <option value="">선택</option>
          {TIME_SLOTS.slice(0, -1).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      </div>
      <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>종료 시간</Text>
        <Select
          value={endTime}
          onChange={e => onEndTimeChange(e.target.value)}
          aria-label="종료 시간"
        >
          <option value="">선택</option>
          {TIME_SLOTS.slice(1).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      </div>
    </div>
  );
}

function AttendeesAndFloor({ floors }: { floors: number[] }) {
  const { attendees, preferredFloor, onAttendeesChange, onPreferredFloorChange } = useFilterPanel();
  return (
    <div css={css`display: flex; gap: 12px;`}>
      <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>참석 인원</Text>
        <input
          type="number"
          min={1}
          max={MAX_ATTENDEES}
          value={attendees}
          onChange={e => onAttendeesChange(Math.min(MAX_ATTENDEES, Math.max(1, Number(e.target.value))))}
          aria-label="참석 인원"
          css={css`
            box-sizing: border-box; font-size: 16px; font-weight: 500; line-height: 1.5; height: 48px;
            background-color: ${colors.grey50}; border-radius: 12px; color: ${colors.grey800};
            width: 100%; border: 1px solid ${colors.grey200}; padding: 0 16px; outline: none;
            transition: border-color 0.15s; &:focus { border-color: ${colors.blue500}; }
          `}
        />
      </div>
      <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>선호 층</Text>
        <Select
          value={preferredFloor ?? ''}
          onChange={e => {
            const val = e.target.value;
            onPreferredFloorChange(val === '' ? null : Number(val));
          }}
          aria-label="선호 층"
        >
          <option value="">전체</option>
          {floors.map(f => (
            <option key={f} value={f}>{f}층</option>
          ))}
        </Select>
      </div>
    </div>
  );
}

function EquipmentSelector() {
  const { equipment, onEquipmentChange } = useFilterPanel();
  return (
    <div>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>필요 장비</Text>
      <Spacing size={8} />
      <div css={css`display: flex; gap: 8px; flex-wrap: wrap;`}>
        {ALL_EQUIPMENT.map(eq => {
          const selected = equipment.includes(eq);
          return (
            <button
              key={eq}
              type="button"
              onClick={() => {
                const next = selected ? equipment.filter(e => e !== eq) : [...equipment, eq];
                onEquipmentChange(next);
              }}
              aria-label={EQUIPMENT_LABELS[eq]}
              aria-pressed={selected}
              css={css`
                padding: 8px 16px; border-radius: 20px;
                border: 1px solid ${selected ? colors.blue500 : colors.grey200};
                background: ${selected ? colors.blue50 : colors.grey50};
                color: ${selected ? colors.blue600 : colors.grey700};
                font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.15s;
                &:hover { border-color: ${selected ? colors.blue500 : colors.grey400}; }
              `}
            >
              {EQUIPMENT_LABELS[eq]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ValidationError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div css={css`padding: 0 24px;`}>
      <Spacing size={8} />
      <span css={css`color: ${colors.red500}; font-size: 14px;`} role="alert">{message}</span>
    </div>
  );
}

export function FilterPanel({
  children,
  date, startTime, endTime, attendees, equipment, preferredFloor,
  onDateChange, onStartTimeChange, onEndTimeChange,
  onAttendeesChange, onEquipmentChange, onPreferredFloorChange,
}: FilterPanelProps) {
  return (
    <FilterPanelContext.Provider value={{
      date, startTime, endTime, attendees, equipment, preferredFloor,
      onDateChange, onStartTimeChange, onEndTimeChange,
      onAttendeesChange, onEquipmentChange, onPreferredFloorChange,
    }}>
      {children}
    </FilterPanelContext.Provider>
  );
}

FilterPanel.DateField = DateField;
FilterPanel.TimeFields = TimeFields;
FilterPanel.AttendeesAndFloor = AttendeesAndFloor;
FilterPanel.EquipmentSelector = EquipmentSelector;
FilterPanel.ValidationError = ValidationError;
