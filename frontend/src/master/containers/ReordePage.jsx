import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";
import { useCart, useUser } from "../hooks";
import LoadingSpinner from "../components/LoadingSpinner";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import ReOrderCartItem from "../components/ReOrderCartItem";

const ReordePage = () => {
    const { cartListQuery } = useCart({ load: true })
    const { data: cartData, isLoading, isFetching, isPending } = cartListQuery
    const [cart, setCart] = useImmer([])
    const [CartState, setCartState] = useImmer({
        cart: [],
        coupon: null,
        total: 0,
        subtotal: 0
    });

    useEffect(() => {
        if (!isLoading && !isFetching && !isPending) {
            setCart(cartData)
        }
        if (cartData) {
            const subtotal = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
            let total = subtotal;
            if (CartState.coupon) {
                const discount = subtotal * (coupon.discountPercentage / 100);
                total = subtotal - discount;
            }
            setCartState((draft) => {
                draft.cart = cartData;
                draft.subtotal = subtotal;
                draft.total = total;
                return draft
            })
        }
    }, [cartData])

    useEffect(() => {
        if (cart) {
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            let total = subtotal;
            if (CartState.coupon) {
                const discount = subtotal * (coupon.discountPercentage / 100);
                total = subtotal - discount;
            }
            setCartState((draft) => {
                draft.cart = cart;
                draft.subtotal = subtotal;
                draft.total = total;
                return draft
            })
        }
    }, [cart])

    const { addresses, isLoading: addressLoading } = useUser({ load: true })

    const removeFromCart = (productId, size) => {
        const updatedCart = cart.filter(item => !(item._id === productId && item.size === size));
        setCart(updatedCart);
    };

    const updateQuantity = (id, quantity, size) => {
        if (quantity < 0) return;
        if (quantity < 1 && cart.length <= 1) return
        if (quantity === 0) return removeFromCart(id, size)
        const updatedCart = cart.map(item => {
            if (item._id === id && item.size === size) {
                return { ...item, quantity };
            }
            return item;
        });
        setCart(updatedCart);
    };

    if (isLoading || addressLoading || isFetching || isPending) {
        return <LoadingSpinner />
    }

    return (
        <div className='py-8 md:py-16'>
            <div className='mx-auto max-w-screen-xl px-4 2xl:px-0'>
                <div className='mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8'>
                    <motion.div
                        className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl'
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {cart.length === 0 ? (
                            <EmptyCartUI />
                        ) : (
                            <div className='space-y-6'>
                                {cart.length > 0 && cart.map((item, index) => (
                                    <ReOrderCartItem key={item._id + 'recartitem' + index} data={cart} item={item} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
                                ))}
                            </div>
                        )}
                        {cart.length > 0 && <PeopleAlsoBought />}
                    </motion.div>

                    {cart.length > 0 && (
                        <motion.div
                            className='mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full'
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <OrderSummary data={addresses} cartData={CartState} />
                            <GiftCouponCard />
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ReordePage;

const EmptyCartUI = () => (
    <motion.div
        className='flex flex-col items-center justify-center space-y-4 py-8'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <ShoppingCart className='h-24 w-24 text-gray-300' />
        <h3 className='text-2xl font-semibold '>Your cart is empty</h3>
        <p className='text-gray-400'>Looks like you {"haven't"} added anything to your cart yet.</p>
        <Link
            className='mt-4 rounded-md bg-emerald-500 px-6 py-2 text-white transition-colors hover:bg-emerald-600'
            to='/'
        >
            Start Shopping
        </Link>
    </motion.div>
);