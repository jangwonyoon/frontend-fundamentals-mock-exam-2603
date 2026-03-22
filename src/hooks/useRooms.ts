import { useQuery } from '@tanstack/react-query';
import { getRooms } from 'pages/remotes';
import { queryKeys } from 'shared/queryKeys';

export function useRooms() {
  return useQuery(queryKeys.rooms, getRooms);
}
