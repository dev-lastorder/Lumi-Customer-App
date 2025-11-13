export const getBaseVariationIdForItem = (item: any): string => (item.variations?.length > 0 ? item.variations[0].id : `${item.id}_default_var`);
