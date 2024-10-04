import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateProductForm from '../components/CreateProductForm'
import ProductsList from '../components/ProductsList'
import AnalyticsTab from '../components/AnalyticsTab'
import EditProductForm from '../components/EditProductForm'
import AdminLayout from '../layout/AdminLayout'
import CategoryList from '../components/CategoryList'
import ManageOrders from '../containers/ManageOrders'

const AdminRoutes = () => {
    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<AnalyticsTab />} />
                <Route path="/create-product" element={<CreateProductForm />} />
                <Route path="/products" element={<ProductsList />} />
                <Route path="/products/:id" element={<EditProductForm />} />
                <Route path="/category" element={<CategoryList />} />
                <Route path="/orders" element={<ManageOrders />} />
            </Routes>
        </AdminLayout>
    )
}

export default AdminRoutes
