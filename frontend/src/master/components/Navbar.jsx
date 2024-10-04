import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppScope, useCartScope } from "../context";
import { useAuth } from "..";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
    const { AppState: { user } } = useAppScope();
    const { CartState: { cart } } = useCartScope()
    const { handleLogout } = useAuth()
    const isAdmin = user?.role === "admin";

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.body.addEventListener('click', handleOutsideClick);

        return function cleanup() {
            document.body.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-20 transition-all duration-300 border-b border-emerald-800'>
            <div className='container mx-auto px-4 py-3'>
                <div className='flex flex-wrap justify-between items-center'>
                    <Link to='/' className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'>
                        E-Commerce
                    </Link>

                    <nav className='flex flex-wrap items-center gap-4'>
                        {user && (
                            <Link
                                to={"/cart"}
                                className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 
							ease-in-out'
                            >
                                <ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
                                <span className='hidden sm:inline'>Cart</span>
                                {cart?.length > 0 && (
                                    <span
                                        className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
                                    >
                                        {cart?.length}
                                    </span>
                                )}
                            </Link>
                        )}
                        {isAdmin && (
                            <Link
                                className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center'
                                to={"/secret-dashboard"}
                            >
                                <Lock className='inline-block mr-1' size={18} />
                                <span className='hidden sm:inline'>Dashboard</span>
                            </Link>
                        )}

                        {user ? (
                            <div className="relative inline-block text-left" ref={dropdownRef} >
                                <button
                                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                                    onClick={toggleDropdown}
                                >
                                    <User size={18} />
                                    <span className="hidden sm:inline ml-2">Account</span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                        <ul className="py-1">
                                            <li>
                                                <Link to="profile"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    onClick={toggleDropdown}
                                                >
                                                    Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="wishlist"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    onClick={toggleDropdown}
                                                >
                                                    Wishlist
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="orders"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    onClick={toggleDropdown}
                                                >
                                                    Orders
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                                    onClick={handleLogout}
                                                >
                                                    <LogOut size={18} className="inline mr-2" />
                                                    Log Out
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    to={"/signup"}
                                    className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-2 sm:px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
                                >
                                    <UserPlus className='mr-2' size={18} />
                                    Sign Up
                                </Link>
                                <Link
                                    to={"/login"}
                                    className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
                                >
                                    <LogIn className='mr-2' size={18} />
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div >
        </header >
    );
};

export default Navbar