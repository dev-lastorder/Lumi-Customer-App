import { useMutation } from '@apollo/client';
import { ADD_RESTAURANT_TO_FAVOURITE } from '../graphql';
import { setUser } from '@/redux';
import { useDispatch } from 'react-redux';

export const useRestaurantFavourite = () => {
  // Hook
  const dispatch = useDispatch();

  // API
  const [mutate, { loading: isFavourting }] = useMutation(ADD_RESTAURANT_TO_FAVOURITE, {
    onCompleted: (data) => {
      const favourite = data?.addFavourite?.favourite;
      dispatch(setUser({ favourite }));
    },
  });

  // Handlers
  const onToggleFavourite = (id: string) => {
    mutate({
      variables: {
        id,
      },
    });
  };

  return {
    onToggleFavourite,
    isFavourting,
  };
};
