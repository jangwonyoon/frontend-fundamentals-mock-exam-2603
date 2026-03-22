import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReservation } from 'pages/remotes';
import { queryKeys } from 'shared/queryKeys';

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation(createReservation, {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(queryKeys.reservations.byDate(variables.date));
      queryClient.invalidateQueries(queryKeys.myReservations);
    },
  });
}
