import React from 'react';
import { useUser } from '../hooks';
import { AddressForm } from '../components';
import { useAppScope } from '..';

export const MyProfile = () => {
    const { AppState: { user } } = useAppScope()
    const {
        newAddress,
        editingAddress,
        addresses,
        isLoading,
        handleAddAddress,
        handleUpdateAddress,
        handleDeleteAddress,
        handleEditChange,
        handleCreateChange,
        setEditingAddress
    } = useUser({ load: true })

    return (
        <div className="container mx-auto p-8 max-w-4xl  shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-white-200">My Profile</h1>
            <div className="mb-8  p-4 border rounded-lg  shadow-sm">
                <p className="text-lg font-medium text-gray-100"><strong>Name:</strong> {user.name}</p>
                <p className="text-lg font-medium text-gray-100"><strong>Email:</strong> {user.email}</p>
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-gray-200">Manage Addresses</h2>
            {isLoading ? (
                <p className="text-lg text-gray-500">Loading addresses...</p>
            ) : (
                <div>
                    <ul className="mb-8 space-y-4">
                        {!!addresses && addresses?.map((address) => (
                            <li key={address._id} className="p-4 border rounded-lg  shadow-sm">
                                {editingAddress && editingAddress._id === address._id ? (
                                    <div>
                                        <AddressForm handleChange={handleEditChange} newAddress={editingAddress} />
                                        <div className="mt-4 flex space-x-2">
                                            <button
                                                onClick={() => handleUpdateAddress(editingAddress._id)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingAddress(null)}
                                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-100">{address.name}, {address.contact}, {address.address}, {address.city},{address.pincode}, {address.country}</p>
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => setEditingAddress(address)}
                                                className="text-blue-500 hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAddress(address._id)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="mb-8 p-4 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-gray-100">Add New Address</h3>
                        <AddressForm handleChange={handleCreateChange} newAddress={newAddress} />
                        <button
                            onClick={handleAddAddress}
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Add Address
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
