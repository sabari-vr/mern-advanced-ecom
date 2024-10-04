import React, { useState } from 'react'
import { useReview } from '../hooks'
import LoadingSpinner from '../components/LoadingSpinner'
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion";
import { errorMessage } from '../../utils';

export const RateProduct = () => {
    const navigate = useNavigate()
    const { productListQuery, createReviewMutation } = useReview({ load: true, productId: null })
    const { data: productData, isLoading, isFetching, isPending } = productListQuery

    const [ratings, setRatings] = useState({})
    const [reviews, setReviews] = useState({})

    const handleRatingChange = (productId, rating) => {
        setRatings((prevRatings) => ({ ...prevRatings, [productId]: rating }))
    }

    const handleReviewChange = (productId, review) => {
        setReviews((prevReviews) => ({ ...prevReviews, [productId]: review }))
    }

    const handleSubmit = (productId) => {
        const rating = ratings[productId]
        const review = reviews[productId]
        if (!rating || !review) return errorMessage('Rating and Review are mandatory')
        createReviewMutation.mutate({ productId, rating, review })
    }

    if (isLoading || isFetching || isPending) {
        return <LoadingSpinner />
    }

    return (
        <div>
            {!isLoading && productData?.items?.length > 0 && productData?.items?.map((item) => {
                const currentRating = ratings[item.productId] || 0
                const currentReview = reviews[item.productId] || ''

                return (
                    <div className='py-8 md:py-16'>
                        <div className='mx-auto max-w-screen-xl px-4 2xl:px-0'>
                            <motion.div
                                className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl'
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <div key={item.productId} className='rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 sm:p-6'>
                                    <div className='space-y-4 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:space-y-0'>
                                        <div className='flex items-center justify-between sm:order-1 w-full'>
                                            <div className='flex-1 ml-4 min-w-0'>
                                                <p className='text-base font-medium text-white hover:text-emerald-400 hover:underline truncate' onClick={() => navigate('/product/' + item.productId)}>
                                                    {item.name}
                                                </p>
                                            </div>
                                            <div className="inline-flex items-center">
                                                {item.size}
                                            </div>
                                        </div>

                                        <div className='flex items-center justify-between sm:order-3'>
                                            <div className='flex items-center gap-2'>
                                                <p>{item.quantity}</p>
                                            </div>

                                            <div className='text-right sm:w-32'>
                                                <p className='text-base font-bold text-emerald-400'>₹ {item.quantity > 0 ? item.quantity * item.price : item.price}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="mt-4">
                                        <p className="text-white">Rate this product:</p>
                                        <div className="flex space-x-2">
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <label key={rating}>
                                                    <input
                                                        type="radio"
                                                        name={`rating-${item.productId}`}
                                                        value={rating}
                                                        checked={currentRating === rating}
                                                        onChange={() => handleRatingChange(item.productId, rating)}
                                                    />
                                                    <span className="text-yellow-400">★</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Review Text Area */}
                                    <div className="mt-4">
                                        <p className="text-white">Write a review:</p>
                                        <textarea
                                            className="w-full p-2 mt-1 text-gray-900 border rounded-lg focus:ring-emerald-400 focus:border-emerald-400"
                                            rows="3"
                                            value={currentReview}
                                            onChange={(e) => handleReviewChange(item.productId, e.target.value)}
                                            placeholder="Share your experience about this product..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-4 text-right">
                                        <button
                                            className="px-4 py-2 font-bold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600"
                                            onClick={() => handleSubmit(item.productId)}
                                        >
                                            Submit Review
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
