// utils/createImageArray.ts
export const createImageArray = (uri: string, count = 3) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    imageUri: uri,
  }));
};
