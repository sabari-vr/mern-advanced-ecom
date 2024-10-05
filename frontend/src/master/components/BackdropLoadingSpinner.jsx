import React, { useEffect } from 'react';

const BackdropLoadingSpinner = ({ isLoading, text }) => {
    useEffect(() => {
        // Prevent scrolling when loading
        if (isLoading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isLoading]);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="text-center">
                <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-white border-t-transparent mb-4"></div>
                <p className="text-white text-xl">{text || "Loading..."}</p>
            </div>
        </div>
    );
};

export default BackdropLoadingSpinner;
