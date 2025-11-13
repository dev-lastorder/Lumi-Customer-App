import { ProductDetailModal } from '@/components/features/product-detail-modal';
import { ConfirmationModal } from '@/components/modals/confirmation-modal';


const GlobalComponent = () => {
    return (
        <>
            <ProductDetailModal />
            <ConfirmationModal
                title="Clear Cart?"
                message="Your cart contains items from a different restaurant. Do you want to clear your cart and add this item?"
                confirmText="Clear & Add"
                cancelText="Keep Cart"
            />
        </>
    )
}

export default GlobalComponent
