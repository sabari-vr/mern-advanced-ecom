import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebarOpen]);

    return (
        <>
            <button
                type="button"
                onClick={toggleSidebar}
                className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
                <span className="sr-only">Open sidebar</span>
                <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    />
                </svg>
            </button>

            <aside
                ref={sidebarRef}
                id="sidebar-multi-level-sidebar"
                className={`fixed top-0 left-0 z-10 w-64 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } sm:translate-x-0 bg-gray-50 dark:bg-gray-800`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <NavLink to="" onClick={() => setIsSidebarOpen(false)}>
                                <div className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                    Dashboard
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="create-product" onClick={() => setIsSidebarOpen(false)}>
                                <div className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                    Create Products
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="products" onClick={() => setIsSidebarOpen(false)}>
                                <div className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                    Product List
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="category" onClick={() => setIsSidebarOpen(false)}>
                                <div className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                    Manage Category
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="orders" onClick={() => setIsSidebarOpen(false)}>
                                <div className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                    Manage Order
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </aside>

            <div className="p-4 sm:ml-64">{children}</div>
        </>
    );
};

export default AdminLayout;
