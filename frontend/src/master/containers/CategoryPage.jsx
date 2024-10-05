import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { useCategory } from "../hooks/useCategory";
import { useCartScope } from "..";
import { FilterIcon } from "lucide-react";

const genderOptions = [
    { value: 0, label: 'Male' },
    { value: 1, label: 'Female' },
    { value: 2, label: 'Gender Neutral' },
];

const forOptions = [
    { value: 0, label: 'Adult' },
    { value: 1, label: 'Kids' },
    { value: 2, label: 'All' },
];

const sizeOptions = [
    { value: 'XS', label: 'Extra Small (XS)' },
    { value: 'S', label: 'Small (S)' },
    { value: 'M', label: 'Medium (M)' },
    { value: 'L', label: 'Large (L)' },
    { value: 'XL', label: 'Extra Large (XL)' },
    { value: 'XXL', label: '2X Large (XXL)' },
    { value: 'XXXL', label: '3X Large (XXXL)' },
    { value: 'XXXXL', label: '4X Large (XXXXL)' },
    { value: 'FREE', label: 'Free Size' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
    { value: '30', label: '30' },
    { value: '32', label: '32' },
    { value: '34', label: '34' },
    { value: '36', label: '36' },
    { value: '38', label: '38' },
    { value: '40', label: '40' },
    { value: '42', label: '42' },
    { value: '44', label: '44' },
    { value: '46', label: '46' },
    { value: '48', label: '48' },
    { value: '50', label: '50' },
];


const CategoryPage = () => {
    const { categoryId } = useParams();
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const { WishListState, toggleWishListMutation } = useCartScope();
    const { productListQuery } = useCategory({ categoryId, load: false });
    const { data, isFetching } = !!productListQuery && productListQuery;
    const { products } = !!data && !isFetching && data;
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter state
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedFor, setSelectedFor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [priceRange, setPriceRange] = useState([100, 10000]); // Adjust price range accordingly

    // Filter logic
    const filteredProducts = products?.filter((product) => {
        const matchesGender = selectedGender ? product.gender == selectedGender : true;
        const matchesFor = selectedFor ? product.for == selectedFor : true;
        const matchesSize = selectedSize ? Object.keys(product.size).some((key) => key == selectedSize) : true;
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        console.log(product.gender, selectedGender);

        return matchesGender && matchesFor && matchesSize && matchesPrice;
    });

    // Price range slider change handler
    const handlePriceChange = (event) => {
        const value = event.target.value;
        setPriceRange([0, value]);
    };

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

                {/* Filters and Products layout */}
                <div className="lg:flex lg:space-x-6">
                    {/* Filters Sidebar for large screens */}
                    <div className='hidden lg:block lg:w-1/4  p-4 rounded-md shadow-md'>
                        <h2 className='text-xl font-semibold mb-4'>Filters</h2>

                        {/* Gender Filter */}
                        <div className='mb-4'>
                            <h3 className='font-medium'>Gender</h3>
                            <select
                                className='mt-2 p-2 w-full border rounded bg-transparent text-white'
                                onChange={(e) => setSelectedGender(e.target.value)}
                                value={selectedGender}
                            >
                                <option value="">All</option>
                                {genderOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* For Filter */}
                        <div className='mb-4'>
                            <h3 className='font-medium'>For</h3>
                            <select
                                className='mt-2 p-2 w-full border rounded bg-transparent text-white'
                                onChange={(e) => setSelectedFor(e.target.value)}
                                value={selectedFor}
                            >
                                <option value="">All</option>
                                {forOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Size Filter */}
                        <div class="mb-4">
                            <h3 class="font-medium">Size</h3>
                            <select
                                class="mt-2 p-2 w-full border rounded bg-transparent text-white"
                                onChange={(e) => setSelectedSize(e.target.value)}
                                value={selectedSize}
                            >
                                <option value="">All</option>
                                {sizeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Filter */}
                        <div className='mb-4'>
                            <h3 className='font-medium'>Price</h3>
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange[1]}
                                onChange={handlePriceChange}
                                className="w-full h-2 bg-emerald-300 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                style={{
                                    accentColor: '#10B981',  // Ensures modern browsers use emerald color for the thumb
                                }}
                            />
                            <div className='text-gray-500'>
                                Price: {priceRange[0]} - {priceRange[1]}
                            </div>
                        </div>
                    </div>

                    {/* Filters for mobile (select dropdown) */}
                    <div className='block lg:hidden mb-8'>
                        <button
                            className="w-auto ml-auto mr-0 p-2 mb-4 rounded-md bg-emerald-700 text-white text-right flex items-center justify-center"
                            style={{ maxWidth: '200px' }}  // Set a fixed width for tablets
                            onClick={() => setIsModalOpen(true)}
                        >

                            <span className="flex items-center">
                                <FilterIcon className="w-5 h-5 mr-2" />
                                Filter products
                            </span>
                        </button>
                    </div>

                    {/* Products section */}
                    <motion.div
                        className='lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {filteredProducts?.length === 0 && (
                            <h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
                                No products found
                            </h2>
                        )}

                        {filteredProducts?.map((product) => (
                            <ProductCard key={product._id + 'category'} product={product} wishListMutation={toggleWishListMutation} wishListState={WishListState} />
                        ))}
                    </motion.div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="p-6 rounded-lg shadow-lg w-11/12 max-w-lg backdrop-filter backdrop-blur-lg border border-white/10 relative">
                        {/* Close Button */}
                        <button
                            className="absolute top-3 right-3 text-white bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ✕
                        </button>

                        <h2 className="text-lg font-medium mb-4">Filter Products</h2>

                        {/* Gender Filter */}
                        <select
                            className="w-full p-2 mb-4 border rounded-md"
                            onChange={(e) => setSelectedGender(e.target.value)}
                            value={selectedGender}
                        >
                            <option value="">Select Gender</option>
                            {genderOptions.map((g) => (
                                <option key={g.value} value={g.value}>
                                    {g.label}
                                </option>
                            ))}
                        </select>

                        {/* For Filter */}
                        <select
                            className="w-full p-2 mb-4 border rounded-md"
                            onChange={(e) => setSelectedFor(e.target.value)}
                            value={selectedFor}
                        >
                            <option value="">Select For</option>
                            {forOptions.map((f) => (
                                <option key={f.value} value={f.value}>
                                    {f.label}
                                </option>
                            ))}
                        </select>

                        {/* Size Filter */}
                        <select
                            className="w-full p-2 mb-4 border rounded-md"
                            onChange={(e) => setSelectedSize(e.target.value)}
                            value={selectedSize}
                        >
                            <option value="">Select Size</option>
                            {sizeOptions.map((s) => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                        <div className='mb-4'>
                            <h3 className='font-medium'>Price</h3>
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange[1]}
                                onChange={handlePriceChange}
                                className="w-full h-2  mb-4 border bg-emerald-300 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                style={{
                                    accentColor: '#10B981',  // Ensures modern browsers use emerald color for the thumb
                                }}
                            />
                            <div className='text-gray-500'>
                                Price: {priceRange[0]} - {priceRange[1]}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between">
                            {/* Clear Filters Button */}
                            <button
                                className="w-1/2 p-2 mr-2 border rounded-md bg-gray-500 text-white"
                                onClick={() => {
                                    setSelectedGender("");
                                    setSelectedFor("");
                                    setSelectedSize("");
                                }}
                            >
                                Clear Filters
                            </button>

                            {/* Apply Filters Button */}
                            <button
                                className="w-1/2 p-2 ml-2 border rounded-md bg-emerald-500 text-white"
                                onClick={() => setIsModalOpen(false)}
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
