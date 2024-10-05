import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { useCategory } from "../hooks/useCategory";
import { useCartScope } from "..";
import { FilterIcon } from "lucide-react";
import { useImmer } from "use-immer";
import LoadingSpinner from "../components/LoadingSpinner";

const CategoryPage = () => {
    const [searchParams] = useSearchParams();
    const { categoryId } = useParams();
    const category = searchParams.get('category');
    const { WishListState, toggleWishListMutation } = useCartScope();
    const { productListQuery, setPagination, pagination, sizeOptions, forOptions, genderOptions } = useCategory({ categoryId, load: false });
    const { data, isFetching, isLoading } = !!productListQuery && productListQuery;
    const [products, setProducts] = useImmer([])
    const initialFilter = {
        selectedGender: "",
        selectedFor: "",
        selectedSize: "",
        priceRange: [0, 10000],
    }
    const [filter, setFilter] = useImmer(initialFilter)
    const [isFiltered, setIsFiltered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (data && !isFetching) {
            setProducts(prevProducts => [...prevProducts, ...data.products]);
        }
    }, [data, isFetching]);

    useEffect(() => {
        const isFilterChanged = () => {
            return (
                pagination.selectedGender !== initialFilter.selectedGender ||
                pagination.selectedFor !== initialFilter.selectedFor ||
                pagination.selectedSize !== initialFilter.selectedSize ||
                pagination.priceRange[0] !== initialFilter.priceRange[0] ||
                pagination.priceRange[1] !== initialFilter.priceRange[1]
            );
        };

        setIsFiltered(isFilterChanged());
    }, [pagination]);

    const loadMore = () => {
        if (!data.pagination || data.pagination.totalPages === pagination.page) return
        setPagination(draft => {
            draft.page += 1;
        });
    };

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop
            >= document.documentElement.offsetHeight - 100
        ) {
            console.log('Reached bottom of page');
            loadMore();
        }
    }, [loadMore]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    const handleChange = (name, value) => {
        setFilter((draft) => {
            draft[name] = value;
            draft.page = 1;
            return draft
        });
    };

    const applyFilter = () => {
        setPagination((draft) => {
            draft.selectedGender = filter.selectedGender;
            draft.selectedFor = filter.selectedFor;
            draft.selectedSize = filter.selectedSize;
            draft.priceRange = filter.priceRange;
            draft.page = 1;
            return draft
        });
        setIsModalOpen(false)
        setProducts([])
    }

    const clearFilter = () => {
        setPagination((draft) => {
            draft.selectedGender = "";
            draft.selectedFor = "";
            draft.selectedSize = "";
            draft.priceRange = [0, 10000];
            draft.page = 1;
            return draft
        });
        setFilter(initialFilter)
        setIsModalOpen(false)
        setProducts([])
    }


    if ((isLoading || isFetching) && products.length === 0) {
        return <LoadingSpinner />
    }

    return (
        <div className='min-h-screen'>
            <div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <motion.h1
                    className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.h1>

                <div className="lg:flex lg:space-x-6">
                    <div className='hidden lg:block lg:w-1/4 p-4 rounded-md shadow-md'>
                        <h2 className='text-xl font-semibold mb-4'>Filters</h2>

                        <div className='mb-4'>
                            <h3 className='font-medium'>Gender</h3>
                            <select
                                className='mt-2 p-2 w-full border rounded bg-transparent text-white'
                                name="selectedGender"
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                value={filter.selectedGender}
                            >
                                <option value="">All</option>
                                {genderOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='mb-4'>
                            <h3 className='font-medium'>For</h3>
                            <select
                                className='mt-2 p-2 w-full border rounded bg-transparent text-white'
                                name="selectedFor"
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                value={filter.selectedFor}
                            >
                                <option value="">All</option>
                                {forOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='mb-4'>
                            <h3 className='font-medium'>Size</h3>
                            <select
                                className='mt-2 p-2 w-full border rounded bg-transparent text-white'
                                name="selectedSize"
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                                value={filter.selectedSize}
                            >
                                <option value="">All</option>
                                {sizeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='mb-4'>
                            <h3 className='font-medium'>Price</h3>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                name="priceRange"
                                value={filter.priceRange[1]}
                                onChange={(e) => handleChange('priceRange', [0, e.target.value])}
                                className="w-full h-2 bg-emerald-300 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                style={{
                                    accentColor: '#10B981',
                                }}
                            />
                            <div className='text-gray-500'>
                                Price: {filter.priceRange[0]} - {filter.priceRange[1]}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="w-1/2 p-2 mr-2 rounded-md bg-gray-500 text-white"
                                onClick={clearFilter}
                            >
                                Clear Filters
                            </button>

                            <button
                                className="w-1/2 p-2 ml-2 rounded-md bg-emerald-700 text-white"
                                onClick={applyFilter}
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>


                    <div className='block lg:hidden mb-8'>
                        <div className="w-auto ml-auto mr-0 mb-4 flex justify-end items-center">
                            {isFiltered && (<span className="mr-4" onClick={clearFilter}>Clear Filters</span>)}
                            <button
                                className="p-2 rounded-md bg-emerald-700 text-white flex items-center"
                                style={{ maxWidth: '200px' }}
                                onClick={() => setIsModalOpen(true)}
                            >
                                <span className="flex items-center">
                                    <FilterIcon className="w-5 h-5 mr-2" />
                                    Filter products
                                </span>
                            </button>
                        </div>
                    </div>

                    <motion.div
                        className='lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {products?.length === 0 && (
                            <h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
                                No products found
                            </h2>
                        )}

                        {products?.map((product) => (
                            <ProductCard key={product._id + 'category'} product={product} wishListMutation={toggleWishListMutation} wishListState={WishListState} />
                        ))}
                    </motion.div>
                    {isLoading && (

                        <div className="flex justify-center mt-6">
                            <motion.div
                                className='w-10 h-10 border-4 border-t-4 border-t-green-500 border-green-200 rounded-full'
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="p-6 rounded-lg shadow-lg w-11/12 max-w-lg backdrop-filter backdrop-blur-lg border border-white/10 relative">
                        <button
                            className="absolute top-3 right-3 text-white bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ✕
                        </button>

                        <h2 className="text-lg font-medium mb-4">Filter Products</h2>

                        <select
                            className="w-full p-2 mb-4 border rounded-md"
                            name="selectedGender"
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            value={filter.selectedGender}
                        >
                            <option value="">Select Gender</option>
                            {genderOptions.map((g) => (
                                <option key={g.value} value={g.value}>
                                    {g.label}
                                </option>
                            ))}
                        </select>

                        <select
                            className="w-full p-2 mb-4 border rounded-md"
                            name="selectedFor"
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            value={filter.selectedFor}
                        >
                            <option value="">Select For</option>
                            {forOptions.map((f) => (
                                <option key={f.value} value={f.value}>
                                    {f.label}
                                </option>
                            ))}
                        </select>

                        <select
                            className="w-full p-2 mb-4 border rounded-md"
                            name="selectedSize"
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            value={filter.selectedSize}
                        >
                            <option value="">Select Size</option>
                            {sizeOptions.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>

                        <div className="mb-4">
                            <h3 className="font-medium">Price</h3>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                name="priceRange"
                                value={filter.priceRange[1]}
                                onChange={(e) => handleChange('priceRange', [0, e.target.value])}
                                className="w-full h-2 mb-4 border bg-emerald-300 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                style={{
                                    accentColor: '#10B981',
                                }}
                            />
                            <div className="text-gray-500">
                                Price: {filter.priceRange[0]} - {filter.priceRange[1]}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                className="w-1/2 p-2 mr-2 rounded-md bg-gray-500 text-white"
                                onClick={clearFilter}
                            >
                                Clear Filters
                            </button>

                            <button
                                className="w-1/2 p-2 ml-2 rounded-md bg-emerald-700 text-white"
                                onClick={applyFilter}
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}



        </div>
    );
};

export default CategoryPage;
