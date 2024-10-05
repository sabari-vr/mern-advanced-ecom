import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { MoveRight, Plus } from "lucide-react";
import { useCartScope } from "../context";
import { Axios, errorMessage } from "../../utils";
import { useImmer } from "use-immer";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

const OrderSummary = ({ data, cartData = false, setLoading }) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient();
    const { CartState } = useCartScope();
    const { total, subtotal, coupon, isCouponApplied, cart } = cartData ? cartData : CartState
    const itemsInCart = cart.map(({ _id, size, quantity, price, name, color }) => ({ productId: _id, size, quantity, price, name, color }));
    const savings = subtotal - total;
    const formattedSubtotal = subtotal.toFixed(2);
    const formattedTotal = total.toFixed(2);
    const formattedSavings = savings.toFixed(2);

    const [addresses] = useImmer(data);
    const [selectedAddress, setSelectedAddress] = useImmer(data[0]?._id);

    const handlePayment = async () => {
        try {
            if (!selectedAddress) return errorMessage('Please add a delivery address');
            if (itemsInCart?.length === 0) return errorMessage('Your cart is empty')

            const res = await Axios.post(`/payment/order`, { amount: formattedTotal, itemsInCart });
            handlePaymentVerify(res.data.data);
        } catch (error) {
            if (error.response) {
                if (error.response.data && error.response.data.message) {
                    errorMessage(error.response.data.message);
                } else {
                    errorMessage(`Error: ${error.response.status} ${error.response.statusText}`);
                }
            } else if (error.request) {
                errorMessage('No response received from server. Please try again.');
            } else {
                errorMessage('An unexpected error occurred. Please try again.');
            }
        }
    };

    const handlePaymentVerify = async (data) => {
        const deliveryAddress = addresses.find((e) => e._id === selectedAddress)
        const { _id, userId, createdAt, updatedAt, ...rest } = deliveryAddress
        const options = {
            key: razorpayKeyId,
            amount: data.amount,
            currency: data.currency,
            name: "Sabari V R",
            description: "Test Mode",
            order_id: data.id,
            handler: async (response) => {
                try {
                    setLoading(true)
                    const res = await Axios.post(`/payment/verify`, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        itemsInCart,
                        deliveryAddress: rest,
                        clearCart: !cartData
                    })

                    const verifyData = res.data;
                    if (verifyData.message) {
                        toast.success(verifyData.message);
                        queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
                        navigate(`/order-placed?orderId=${verifyData?.orderId}`);
                    }

                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false)
                }
            },
            theme: {
                color: "#047857"
            },
            modal: {
                ondismiss: () => {
                    navigate('/order-canceled')
                }
            }
        };
        if (window.Razorpay) {
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } else {
            console.error('Razorpay SDK not loaded');
        }
    }

    return (
        <motion.div
            className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <p className='text-xl font-semibold text-emerald-400'>Order summary</p>

            <div className='space-y-4'>
                <div className="space-y-2">
                    <p className="text-base font-semibold text-white">Select Delivery Address</p>
                    {addresses.length > 0 ? (
                        addresses.map((addr) => (
                            <label key={addr._id + 'address'} className="flex items-center space-x-2 text-gray-300">
                                <input
                                    type="radio"
                                    name="address"
                                    value={addr._id}
                                    checked={selectedAddress === addr._id}
                                    onChange={() => setSelectedAddress(addr._id)}
                                    className="text-emerald-500 focus:ring-emerald-400"
                                />
                                <span>{addr.name}, {addr.contact}, {addr.address}</span>
                            </label>
                        ))
                    ) : (
                        <Link
                            to="/profile"
                            className="inline-flex items-center text-emerald-400 hover:text-emerald-300"
                        >
                            <Plus size={16} className="mr-1" />
                            Add a new address
                        </Link>
                    )}
                </div>
                <div className='space-y-2'>
                    <dl className='flex items-center justify-between gap-4'>
                        <dt className='text-base font-normal text-gray-300'>Original price</dt>
                        <dd className='text-base font-medium text-white'>₹ {formattedSubtotal}</dd>
                    </dl>

                    {savings > 0 && (
                        <dl className='flex items-center justify-between gap-4'>
                            <dt className='text-base font-normal text-gray-300'>Savings</dt>
                            <dd className='text-base font-medium text-emerald-400'>-₹ {formattedSavings}</dd>
                        </dl>
                    )}

                    {coupon && isCouponApplied && (
                        <dl className='flex items-center justify-between gap-4'>
                            <dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
                            <dd className='text-base font-medium text-emerald-400'>-{coupon.discountPercentage}%</dd>
                        </dl>
                    )}
                    <dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
                        <dt className='text-base font-bold text-white'>Total</dt>
                        <dd className='text-base font-bold text-emerald-400'>₹ {formattedTotal}</dd>
                    </dl>
                </div>

                <motion.button
                    className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePayment}
                >
                    Proceed to Checkout
                </motion.button>

                <div className='flex items-center justify-center gap-2'>
                    <span className='text-sm font-normal text-gray-400'>or</span>
                    <Link
                        to='/'
                        className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
                    >
                        Continue Shopping
                        <MoveRight size={16} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};
export default OrderSummary;