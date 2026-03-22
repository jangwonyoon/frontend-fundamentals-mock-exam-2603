import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatDate } from 'shared/utils';

export function useDateParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [date, setDate] = useState(searchParams.get('date') || formatDate(new Date()));

  useEffect(() => {
    const today = formatDate(new Date());
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (date && date !== today) {
        next.set('date', date);
      } else {
        next.delete('date');
      }
      return next;
    }, { replace: true });
  }, [date, setSearchParams]);

  return [date, setDate] as const;
}
