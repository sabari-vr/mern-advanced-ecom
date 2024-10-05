import React from 'react';
import { useImmer } from 'use-immer';
import { useOrders } from '../hooks';
import LoadingSpinner from '../components/LoadingSpinner';

export const ManageOrders = () => {
    const [activeOrder, setActiveOrder] = useImmer(null);
    const [selectedStatus, setSelectedStatus] = useImmer(null);
    const { orders, isLoading, updateOrderStatusMutation, pagination, setPage } = useOrders({ isAdmin: true, load: true })
    const { totalPages, totalOrders, hasPreviousPage, hasNextPage, currentPage } = !!pagination && pagination

    const handleUpdateOrder = (id) => {
        updateOrderStatusMutation.mutate({ id, status: selectedStatus })
        setSelectedStatus(null)
    };

    const toggleOrder = (orderId) => {
        setSelectedStatus(null)
        if (activeOrder === orderId) {
            setActiveOrder(null);
        } else {
            setActiveOrder(orderId);
        }
    };

    const handleStatusChange = (value) => {
        setSelectedStatus(value)
    }

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

                        return (
                            <div key={order._id + 'my_orders'} className="mb-4 border rounded-lg">
                                {/* Accordion Header */}
                                <div
                                    className="p-4  flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleOrder(order._id)}
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold">Order ID: {order.paymentId.razorpay_order_id}</h3>
                                        <p className="text-gray-300">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                        <p className="text-gray-300">Last Updated Date: {new Date(order.updatedAt).toLocaleDateString()}</p>
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
                                            <p className="text-gray-400">Status: <span className="text-blue-500">{order.orderStatus}</span></p>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold">User Details</h3>
                                            <p className="text-gray-300">Name: {order.userId.name}</p>
                                            <p className="text-gray-300">Email: {order.userId.email}</p>
                                            <p className="text-gray-300">Contact No: {order.address.contact}</p>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold">Payment Details</h3>
                                            <p className="text-gray-300">Order Id: {order.paymentId.razorpay_order_id}</p>
                                            <p className="text-gray-300">Payment Id: {order.paymentId.razorpay_payment_id}</p>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold">Shipping Address</h3>
                                            <p className="text-gray-300">{order.address.name}</p>
                                            <p className="text-gray-300">{order.address.address}</p>
                                            <p className="text-gray-300">{order.address.city}, {order.address.pincode}</p>
                                            <p className="text-gray-300">{order.address.country}</p>
                                            <p className="text-gray-300">Contact No: {order.address.contact}</p>
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
                                            <select
                                                value={selectedStatus ? selectedStatus : order.orderStatus}
                                                onChange={(e) => handleStatusChange(e.target.value)}
                                                className="border rounded-md p-1 " style={{ color: 'black' }}
                                            >
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="returned">Returned</option>
                                                <option value="refunded">Refunded</option>
                                            </select>
                                            <button
                                                onClick={() => handleUpdateOrder(order._id)}
                                                disabled={updateOrderStatusMutation.isPending}
                                                className="bg-emerald-700 hover:bg-emerald-900 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                                            >
                                                Update Order
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

export default ManageOrders;
