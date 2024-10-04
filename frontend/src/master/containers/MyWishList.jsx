import React from 'react'
import ProductCard from '../components/ProductCard'
import { useCartScope } from '..';
import { motion } from "framer-motion";
import LoadingSpinner from '../components/LoadingSpinner';

export const MyWishList = () => {
    const { WishListState, isWishListLoading, toggleWishListMutation } = useCartScope();
    if (isWishListLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className='min-h-screen'>
            <div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <motion.div
                    className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {WishListState?.length === 0 && (
                        <h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
                            No products wishlisted
                        </h2>
                    )}

                    {WishListState?.map((product) => (
                        <ProductCard key={product._id + 'wishlist'} product={product.product} wishListMutation={toggleWishListMutation} wishListState={WishListState} />
                    ))}

                </motion.div>
            </div>
        </div>
    )
}
