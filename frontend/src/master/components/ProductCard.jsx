import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppScope } from "../context";
import { errorMessage } from "../../utils";

const ProductCard = ({ product, wishListMutation, wishListState }) => {
    const { AppState: { user } } = useAppScope();
    const isWishlisted = wishListState?.some((e) => e?.product?._id == product?._id)

    const handleWishlistClick = () => {
        if (!user) return errorMessage("Please login to wishlist products", { id: "login" });
        wishListMutation.mutate(product._id)
    };

    return (
        <div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
            <Link to={'/product/' + product._id}>
                <div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
                    <img className='object-cover w-full' src={product.images[0]} alt='product image' />
                    <div className='absolute inset-0 bg-black bg-opacity-20' />
                </div>

                <div className='mt-4 px-5 pb-5'>
                    <h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
                    <div className='mt-2 mb-5 flex items-center justify-between'>
                        <p>
                            <span className='text-3xl font-bold text-emerald-400'>₹ {product.price}</span>
                        </p>
                    </div>
                </div>
            </Link>
            <button
                className='absolute bottom-12 right-3 z-100 text-emerald-400 hover:text-emerald-600 transition-colors'
                onClick={handleWishlistClick}
            >
                <Heart
                    size={24}
                    fill={isWishlisted ? "red" : "none"}
                    color={isWishlisted ? "red" : "currentColor"}
                />
            </button>
        </div>
    );
};
export default ProductCard;