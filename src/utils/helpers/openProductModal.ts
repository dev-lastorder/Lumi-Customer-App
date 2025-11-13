// productModalUtils.ts
import { store } from '@/redux/store';
import { openProductDetailModal } from '@/redux/slices/productModalSlice';
import { selectQuantityByProduct } from '@/redux/slices/cartSlice';
import { getBaseVariationIdForItem } from '@/utils';
import { Product } from '@/utils/interfaces/product-detail';
import { AnyAction, Dispatch } from 'redux';

interface OpenProductModalParams {
  dispatch: Dispatch<AnyAction>;
  item: Product;
}

export const openProductModal = (
  dispatch: OpenProductModalParams['dispatch'],
  item: OpenProductModalParams['item']
): void => {
  const state = store.getState();
  const baseVariationId: string = getBaseVariationIdForItem(item);
  const quantityOfBaseConfigInCart: number = selectQuantityByProduct(state, item.id, baseVariationId, []) || 0;

  const isEditing: boolean = quantityOfBaseConfigInCart > 0;
  const defaultAddonIds: string[] = [];

  dispatch(
    openProductDetailModal({
      product: item,
      initialQuantity: isEditing ? quantityOfBaseConfigInCart : 1,
      initialVariationId: isEditing ? baseVariationId : item?.variations?.[0]?.id ?? '',
      initialAddonIds: isEditing ? defaultAddonIds : undefined,
      actionType: isEditing ? 'edit' : 'add',
    })
  );
};
