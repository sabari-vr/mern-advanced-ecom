import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './containers/LoginPage';
import SignUpPage from './containers/SignUpPage';
import EmailVerificationPage from './containers/EmailVerificationPage';
import { AppScope, useAppScope } from './context/AppScope';
import { MyOrders, MyProfile, MyWishList, OrderCanceled, OrderPlaced, ProtectedRoute, RateProduct } from './containers';
import ForgotPasswordPage from './containers/ForgotPasswordPage';
import ResetPasswordPage from './containers/ResetPasswordPage';
import HomePage from './containers/HomePage';
import Navbar from './components/Navbar';
import CategoryPage from './containers/CategoryPage';
import { CartScope } from './context';
import AppLoyout from './layout/AppLoyout';
import CartPage from './containers/CartPage';
import AdminRoutes from './containers/AdminRoutes';
import ProductDetailView from './containers/ProductDetailView';
import ReordePage from './containers/ReordePage';

export const Master = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: false,
            },
        },
    });
    return (
        <QueryClientProvider client={queryClient}>
            <AppScope>
                <CartScope>
                    <AppLoyout>
                        <Navbar />
                        <Routes>
                            <Route path='/' element={<HomePage />} />
                            <Route path='login' element={<LoginPage />} />
                            <Route path='signup' element={<SignUpPage />} />
                            <Route path='verify-email' element={<EmailVerificationPage />} />
                            <Route path='forgot-password' element={<ForgotPasswordPage />} />
                            <Route path='reset-password/:token' element={<ResetPasswordPage />} />
                            <Route path='/category/:categoryId' element={<CategoryPage />} />
                            <Route path='/product/:id' element={<ProductDetailView />} />
                            <Route path='/orders' element={<MyOrders />} />
                            <Route path='/profile' element={<MyProfile />} />
                            <Route path='/order-placed' element={<OrderPlaced />} />
                            <Route path='/order-canceled' element={<OrderCanceled />} />
                            <Route path='/order' element={<ReordePage />} />
                            <Route path='/wishlist' element={<MyWishList />} />
                            <Route path='/rate' element={<RateProduct />} />
                            <Route
                                exact
                                element={
                                    <ProtectedRoute redirectTo={"/login"}>
                                        <Home />
                                    </ProtectedRoute>
                                }
                                path={"/*"}
                            />
                        </Routes>
                    </AppLoyout>
                </CartScope>
            </AppScope>
        </QueryClientProvider>
    )
}

const Home = () => {
    const {
        AppState: { user },
    } = useAppScope();
    return (
        <Routes>
            <Route path="/secret-dashboard/*" element={user?.role === "admin" ? <AdminRoutes /> : <Navigate to='/' replace />} />
            <Route path='*' element={<Navigate to='/' replace />} />
            <Route path='/cart' element={<CartPage />} />
        </Routes>
    );
};
