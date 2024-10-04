import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import { Trash, Save, X, Plus, Upload } from "lucide-react";
import { useCategory } from '..';

const CategoryList = () => {
    const {
        categories,
        isLoading,
        handleAdd,
        handleSave,
        handleDelete,
        editingId,
        handleEdit,
        newCategoryName,
        setNewCategoryName,
        setEditingId,
        setEditName,
        editName,
        previewImages,
        setPreviewImages,
        previewImagesEdit,
        setPreviewImagesEdit
    } = useCategory({ load: true, category: null });

    useEffect(() => {
        if (!editingId) {
            setPreviewImagesEdit(false);
        }
    }, [editingId]);

    const handleImagePreview = (event, isEdit = false) => {
        const file = event.target.files[0];
        if (file) {
            const preview = { url: URL.createObjectURL(file), file: file };
            if (isEdit) {
                setPreviewImagesEdit([preview]);
            } else {
                setPreviewImages([preview]);
            }
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <motion.div
            className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {/* New Category Row */}
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="New category name"
                                    className="bg-gray-700 text-white px-4 py-2 rounded w-full md:w-auto"
                                />
                                <input
                                    type="file"
                                    id="newCategoryImage"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={(e) => handleImagePreview(e, false)}
                                />
                                <label
                                    htmlFor="newCategoryImage"
                                    className="cursor-pointer bg-gray-700 py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                >
                                    <Upload className="h-5 w-5 inline-block mr-2" />
                                    Upload Image
                                </label>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                                onClick={handleAdd}
                                className="text-white bg-green-500 hover:bg-green-400 px-4 py-2 rounded flex items-center space-x-2 transition"
                            >
                                <Plus className="h-5 w-5" /> <span>Add Category</span>
                            </button>
                        </td>
                    </tr>

                    {/* Existing Categories Rows */}
                    {categories?.map((category) => (
                        <tr key={category._id} className="hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                    {editingId === category._id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="bg-gray-700 text-white px-4 py-2 rounded w-full md:w-auto"
                                            />
                                            <input
                                                type="file"
                                                id="editCategoryImage"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={(e) => handleImagePreview(e, true)}
                                            />
                                            <label
                                                htmlFor="editCategoryImage"
                                                className="cursor-pointer bg-gray-700 py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                            >
                                                <Upload className="h-5 w-5 inline-block mr-2" />
                                                Upload Image
                                            </label>
                                        </>
                                    ) : (
                                        <span className="text-sm text-gray-300">{category.name}</span>
                                    )}
                                </div>
                                <div className="mt-2">
                                    <img
                                        className="h-16 w-auto"
                                        src={editingId === category._id && !!previewImagesEdit ? previewImagesEdit[0].url : category.image}
                                        alt="Category Preview"
                                    />
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {editingId === category._id ? (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleSave}
                                            className="text-white bg-green-500 hover:bg-green-400 px-4 py-2 rounded transition"
                                        >
                                            <Save className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="text-white bg-red-500 hover:bg-red-400 px-4 py-2 rounded transition"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="text-white bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="text-white bg-red-500 hover:bg-red-400 px-4 py-2 rounded transition"
                                        >
                                            <Trash className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    );
};

export default CategoryList;
