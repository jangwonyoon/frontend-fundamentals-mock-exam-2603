import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReservation } from 'pages/remotes';
import type { CreateReservationRequest } from 'shared/types';

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation(
    (data: CreateReservationRequest) => createReservation(data),
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries(['reservations', variables.date]);
        queryClient.invalidateQueries(['myReservations']);
      },
    }
  );
}
