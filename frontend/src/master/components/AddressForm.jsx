import React from 'react';

export const AddressForm = ({ handleChange, newAddress }) => {
    return (
        <div className="space-y-4" style={{ color: 'white' }}>
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={newAddress.name}
                onChange={(e) => handleChange(e.target)}
                className="border bg-transparent border-gray-100 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <input
                type="number"
                name="contact"
                placeholder="Contact Number"
                value={newAddress.contact}
                onChange={(e) => handleChange(e.target)}
                className="border bg-transparent border-gray-100 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <textarea
                type="text"
                name="address"
                placeholder="Address"
                value={newAddress.address || ""}
                onChange={(e) => handleChange(e.target)}
                className="border bg-transparent border-gray-100 p-3 rounded-lg w-full h-24 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <input
                type="text"
                name="city"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => handleChange(e.target)}
                className="border bg-transparent border-gray-100 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={newAddress.pincode}
                onChange={(e) => handleChange(e.target)}
                className="border bg-transparent border-gray-100 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <input
                type="text"
                name="country"
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) => handleChange(e.target)}
                className="border bg-transparent border-gray-100 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
        </div>
    );
};
