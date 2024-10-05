import React from 'react';
import { useImmer } from 'use-immer';
import { useOrders } from '../hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export const MyOrders = () => {
    const navigate = useNavigate()
    const [activeOrder, setActiveOrder] = useImmer(null);
    const { orders, isLoading, cancelOrderMutation, setPage, pagination } = useOrders({ isAdmin: false, load: true })
    const { totalPages, totalOrders, hasPreviousPage, hasNextPage, currentPage } = !!pagination && pagination

    const handleCancelOrder = (id) => {
        cancelOrderMutation.mutate(id)
    };

    const toggleOrder = (orderId) => {
        if (activeOrder === orderId) {
            setActiveOrder(null);
        } else {
            setActiveOrder(orderId);
        }
    };

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="min-h-screen  p-4">
            <div className="max-w-4xl mx-auto  p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">My Orders | Total :- {totalOrders}</h2>
                {orders.length > 0 ? (
                    orders.map((order) => {
                        const isActive = activeOrder === order._id;
                        const isCancelPosible = order.orderStatus === "processing"
                        const products = order.items.map((e) => {
                            return (
                                {
                                    productId: e.productId,
                                    size: e.size,
                                    quantity: e.quantity
                                }
                            )
                        })

                        const encodedProducts = encodeURIComponent(JSON.stringify(products));

                        return (
                            <div key={order._id + 'my_orders'} className="mb-4 border rounded-lg">
                                {/* Accordion Header */}
                                <div
                                    className="p-4  flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleOrder(order._id)}
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold">Order ID: {order._id}</h3>
                                        <p className="text-gray-300">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`transform transition-transform ${isActive ? 'rotate-180' : ''}`}>
                                        ⌄
                                    </span>
                                </div>

                                {/* Accordion Content */}
                                {isActive && (
                                    <div className="p-4 ">
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold">Order Details</h3>
                                            <p className="text-gray-500">Status: <span className="text-blue-500">{order.orderStatus}</span></p>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold">Shipping Address</h3>
                                            <p className="text-gray-300">{order.address.name}</p>
                                            <p className="text-gray-300">{order.address.address}</p>
                                            <p className="text-gray-300">{order.address.city}, {order.address.pincode}</p>
                                            <p className="text-gray-300">{order.address.country}</p>
                                            <p className="text-gray-300">Contact: {order.address.contact}</p>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold">Items Ordered</h3>
                                            <div className="space-y-4">
                                                {order.items.map((item, index) => (
                                                    <div key={index} className="flex justify-between items-center border shadow-sm p-4 rounded-lg">
                                                        <div>
                                                            <p className="text-gray-300">Product Name: {item.name}</p>
                                                            <p className="text-gray-100">Colour: {item.color}</p>
                                                            <p className="text-gray-100">Size: {item.size}</p>
                                                            <p className="text-gray-100">Quantity: {item.quantity}</p>
                                                        </div>
                                                        <div className="font-semibold text-gray-300">
                                                            ₹{item.price * item.quantity}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-4 ">
                                            <h5 className="font-semibold text-white-800">
                                                Total: ₹{order.items.reduce((total, item) => total + (item.price * item.quantity), 0)}
                                            </h5>
                                        </div>
                                        <div className="flex justify-end space-x-4">
                                            {isCancelPosible && (
                                                <button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    disabled={cancelOrderMutation.isPending}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                            <button
                                                onClick={() => navigate(`/rate?orderId=${order._id}`)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                                            >
                                                Rate Order
                                            </button>
                                            <button
                                                onClick={() => navigate(`/order?products=${encodedProducts}`)}
                                                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                                            >
                                                Order Again
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })

                ) : (
                    <p className="text-white-500 text-center">No orders found.</p>
                )}
                {orders.length > 0 && (
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!hasPreviousPage}
                            className={`p-2 text-sm font-medium rounded-md ${!hasPreviousPage ? 'bg-gray-600 text-gray-400' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >
                            Previous
                        </button>
                        <div className="text-white">
                            Page {currentPage} of {totalPages}
                        </div>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!hasNextPage}
                            className={`p-2 text-sm font-medium rounded-md ${!hasNextPage ? 'bg-gray-600 text-gray-400' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
