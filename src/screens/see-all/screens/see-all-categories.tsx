import { useState, useCallback } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@apollo/client";
import { GET_ALL_CUISINES } from '@/api/graphql/query/getAllCuisines';

import { useInternetStatus } from "@/hooks";
import Card from "../components/see-all-categories.card";
import {
  CustomText,
  LoadingPlaceholder,
  NoInternetConnection,
  ScreenAnimatedTitleHeader,
  ScreenHeader,
  SomethingWentWrong,
} from "@/components";
import { useRouter, useLocalSearchParams } from "expo-router";

/* ------------------------------------ */
/* 👉 Types */
interface CategoryCard {
  id: string;
  name: string;
  logo: string;
  backgroundColor?: string;
}



/* ------------------------------------ */
/* 👉 Utilities */
const transformCuisineData = (items: any[]): CategoryCard[] =>
  items?.map((c) => ({
    id: `${c._id}`, // 👈 Ensure ID is a string
    name: c.name,
    logo: c.image,
    backgroundColor: undefined,
  })) || [];

const mergeUniqueCuisines = (
  prev: CategoryCard[],
  next: CategoryCard[]
): CategoryCard[] => {
  const existingIds = new Set(prev.map((item) => item.id));
  const filtered = next.filter((item) => !existingIds.has(item.id));
  return [...prev, ...filtered];
};

/* ------------------------------------ */
/* 👉 Card Renderer */
const CuisineCard = ({
  item,
  onPress,
}: {
  item: CategoryCard;
  onPress: (id: string) => void;
}) => (
  <View className="w-[48%] mb-4">
    <Card
      id={item.id}
      name={item.name}
      logo={item.logo}
      backgroundColor={item.backgroundColor}
      onPress={() => onPress(item.id)}
    />
  </View>
);

/* ------------------------------------ */
/* 👉 Main Screen */
export default function SeeAllScreen() {
  const insets = useSafeAreaInsets();
  const isConnected = useInternetStatus();
  const router = useRouter();
  const params = useLocalSearchParams();
  const screenTitle = (params.title as string) || "Categories";
  const scrollY = useSharedValue(0);

  const [page, setPage] = useState(1);
  const [cuisines, setCuisines] = useState<CategoryCard[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { loading, error, fetchMore } = useQuery(GET_ALL_CUISINES, {
    variables: { input: { shopType: "Restaurant", page, limit: 10 } },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const newItems = transformCuisineData(data?.getAllCuisines?.cuisines);
      setCuisines((prev) => mergeUniqueCuisines(prev, newItems)); // 👈 Merge without duplicates

      const { currentPage, totalPages } = data?.getAllCuisines || {};
      setHasMore(currentPage < totalPages);
    },
  });

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;

    fetchMore({
      variables: {
        input: { shopType: "Restaurant", page: nextPage, limit: 10 },
      },
    }).then((res) => {
      const newItems = transformCuisineData(
        res?.data?.getAllCuisines?.cuisines || []
      );
      setCuisines((prev) => mergeUniqueCuisines(prev, newItems)); // 👈 Prevent duplicate keys
      setPage(nextPage);

      const { currentPage, totalPages } = res?.data?.getAllCuisines || {};
      setHasMore(currentPage < totalPages);
    });
  }, [hasMore, loading, fetchMore, page]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleCardPress = (id: string) => {
    router.push({ pathname: "/see-category-restaurants", params: { id } })
  };

  if (error)
    return (
      <SomethingWentWrong
        title="Something went wrong"
        description="Please try again later."
      />
    );

  if (loading && cuisines.length === 0)
    return <LoadingPlaceholder placeholder="Loading categories..." />;

  if (!isConnected)
    return (
      <NoInternetConnection
        title="No internet"
        description="Please check your connection"
      />
    );

  return (
    <View
      className="flex-1 bg-background dark:bg-dark-background"
    >
      <ScreenAnimatedTitleHeader title={screenTitle} onBack={() => router.back()} scrollY={scrollY} />
      <View className="flex-1 px-4">
        <Animated.FlatList
          onScroll={onScroll}
          scrollEventThrottle={16}
          data={cuisines}
          keyExtractor={(item, index) => item.id || index.toString()} // 👈 Key fallback
          ListHeaderComponent={
            <CustomText className="text-black dark:text-white mb-4" variant="heading2" fontWeight="bold" fontSize="3xl">
              {screenTitle}
            </CustomText>
          }
          renderItem={({ item }) => (
            <CuisineCard item={item} onPress={handleCardPress} />
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          ListFooterComponent={hasMore ? <LoadingPlaceholder /> : null}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
