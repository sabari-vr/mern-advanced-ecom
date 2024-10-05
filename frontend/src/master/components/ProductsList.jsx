import { motion } from "framer-motion";
import { Trash, Star, Pencil } from "lucide-react";
import { useManageProduct } from "..";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const ProductsList = () => {
    const navigate = useNavigate()
    const { deleteProduct, toggleFeaturedProduct, productListQuery, setPage } = useManageProduct({ productId: null });
    const { data, isFetching, isLoading } = !!productListQuery && productListQuery
    const { products, pagination } = !!data && !isFetching && data
    const { totalPages, totalProducts, hasPreviousPage, hasNextPage, currentPage } = !!pagination && pagination

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <motion.div
            className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <table className=' min-w-full divide-y divide-gray-700'>
                <thead className='bg-gray-700'>
                    <tr>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                        >
                            Product
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                        >
                            Price
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                        >
                            Category
                        </th>

                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                        >
                            Featured
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
                        >
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody className='bg-gray-800 divide-y divide-gray-700'>
                    {products?.map((product) => (
                        <tr key={product._id} className='hover:bg-gray-700'>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='flex items-center'>
                                    <div className='flex-shrink-0 h-10 w-10'>
                                        <img
                                            className='h-10 w-10 rounded-full object-cover'
                                            src={product.images[0]}
                                            alt={product.name}
                                        />
                                    </div>
                                    <div className='ml-4'>
                                        <div className='text-sm font-medium text-white'>{product.name}</div>
                                    </div>
                                </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-300'>₹ {product.price.toFixed(2)}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-gray-300'>{product?.categoryId?.name}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <button
                                    onClick={() => toggleFeaturedProduct(product._id)}
                                    className={`p-1 rounded-full ${product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
                                        } hover:bg-yellow-500 transition-colors duration-200`}
                                >
                                    <Star className='h-5 w-5' />
                                </button>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                <button
                                    onClick={() => navigate(`${product._id}`)}
                                    className='text-green-400 hover:text-green-300 pe-3'
                                >
                                    <Pencil className='h-5 w-5' />
                                </button>
                                <button
                                    onClick={() => deleteProduct(product._id)}
                                    className='text-red-400 hover:text-red-300'
                                >
                                    <Trash className='h-5 w-5' />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!hasPreviousPage}
                    className={`p-2 text-sm font-medium rounded-md ${!hasPreviousPage ? 'bg-gray-600 text-gray-400' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                    Previous
                </button>
                <div className="text-white">
                    Page {currentPage} of {totalPages} | Total Products : {totalProducts}
                </div>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className={`p-2 text-sm font-medium rounded-md ${!hasNextPage ? 'bg-gray-600 text-gray-400' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                    Next
                </button>
            </div>
        </motion.div>
    );
};
export default ProductsList;