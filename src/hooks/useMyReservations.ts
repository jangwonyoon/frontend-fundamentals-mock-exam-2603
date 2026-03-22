import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyReservations, cancelReservation } from 'pages/remotes';
import { queryKeys } from 'shared/queryKeys';

export function useMyReservations() {
  const queryClient = useQueryClient();

  const query = useQuery(queryKeys.myReservations, getMyReservations);

  const cancelMutation = useMutation(cancelReservation, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.reservations.all);
      queryClient.invalidateQueries(queryKeys.myReservations);
    },
  });

  return {
    ...query,
    myReservations: query.data ?? [],
    cancel: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isLoading,
  };
}
