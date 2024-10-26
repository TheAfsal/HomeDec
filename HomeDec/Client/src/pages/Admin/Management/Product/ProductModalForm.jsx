import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { X, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { listCategory } from '../../../../api/administrator/categoryManagement'
import { addProduct, addProductImage, fetchDetails, updateProduct } from '../../../../api/administrator/productManagement'
import { MANAGEMENT_ROUTES } from '../../../../config/routerConstants'
import ImageCrop from '../../../Test/ImageCrop'

const ProductModalForm = ({ usedFor, isOpen, onClose }) => {

    const { register, control, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm()
    const [error, setError] = useState("")
    const [categoryList, setCategoryList] = useState([])
    const [variants, setVariants] = useState([{ color: '', colorHex: '', stock: '', price: '', images: [] }])
    const [subCategories, setSubCategories] = useState([])
    const navigate = useNavigate()
    const { role } = useSelector(state => state.auth)


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryList = await listCategory(role);
                setCategoryList(categoryList);

                if (usedFor !== "add") {
                    const details = await fetchDetails(usedFor);

                    const selectedCategoryData = categoryList.find(category => category._id === details.product.category);

                    if (selectedCategoryData) {
                        setSubCategories(selectedCategoryData.subcategories);
                        setValue('subCategory', details.product.subCategory?._id)
                    }



                    transformVariants(details)
                        .then(updatedVariants => {
                            setVariants(updatedVariants);
                            uploadImagesForVariants(updatedVariants, setVariants);
                        })
                        .catch(error => {
                            console.error('Error transforming variants:', error);
                        });

                    setTimeout(() => {
                        reset({
                            ...details.product,
                            subCategory: details.product.subCategory?._id
                        })
                    }, 0)

                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCategories();
    }, [usedFor, role, reset]);

    // const watchCategory = watch('category')

    // useEffect(() => {
    //     const selectedCategory = categoryList.find(category => category._id === watchCategory)
    //     if (selectedCategory) {
    //         setSubCategories(selectedCategory.subcategories)
    //     }
    // }, [watchCategory, categoryList])

    async function transformVariants(details) {
        const updatedVariants = await Promise.all(details.product.variants.map(async (variant) => {
            const newImages = await convertImages(variant.images);
            return {
                ...variant,
                images: newImages
            };
        }));

        return updatedVariants;
    }

    async function convertImages(imageArray) {
        const blobPromises = imageArray.map(async (image) => {
            const response = await fetch(image.secure_url);
            const blob = await response.blob();

            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            return {
                id: Date.now() + Math.random(),
                imageUrl: base64,
                blob: blob,
                progress: 100
            };
        });

        return Promise.all(blobPromises);
    }

    async function uploadImagesForVariants(updatedVariants, setVariants) {
        const uploadPromises = [];

        for (const variantIndex in updatedVariants) {
            const variant = updatedVariants[variantIndex];

            console.log(updatedVariants[variantIndex]);


            for (const posIndex in variant.images) {
                const image = variant.images[posIndex];

                const formData = new FormData();
                formData.append('image', image.blob, `image-${Date.now()}.png`);
                formData.append('filename', image.id);

                const uploadPromise = addProductImage(formData, variantIndex, posIndex, setVariants)
                    .catch((error) => {
                        console.log(`Error uploading image for variant ${variantIndex}, image ${posIndex}:`, error);
                    });

                uploadPromises.push(uploadPromise);
            }
        }

        try {
            await Promise.all(uploadPromises);
            console.log('All images uploaded successfully');
        } catch (error) {
            console.log('Error during image upload:', error);
        }
    }

    const onSubmit = async (data) => {

        console.log("submit clicked");

        if (variants.length === 0) {
            setError("You must add at least one variant.")
            return
        }
        for (let i = 0; i < variants.length; i++) {
            if (variants[i].images.length < 3) {
                setError(`Variant ${i + 1} must have at least 3 images.`)
                return
            }
        }

        try {
            
            data.variants = data.variants.map((variant, index) => {
                const imageIds = variants[index]?.images.map(image => image.id) || [];
                return {
                    ...variant,
                    images: imageIds
                };
            });
            
            if (usedFor !== "add") {
                updateProduct(data, usedFor)
                    .then((_) => {
                        onClose()
                        navigate(`/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.PRODUCTS}/${MANAGEMENT_ROUTES.PRODUCTS_LIST}`)
                    }).catch((error) => {
                        console.error('Error:', error)
                    })
            } else {
                addProduct(data)
                    .then((_) => {
                        onClose()
                        navigate(`/${MANAGEMENT_ROUTES.MANAGEMENT}/${MANAGEMENT_ROUTES.PRODUCTS}/${MANAGEMENT_ROUTES.PRODUCTS_LIST}`)
                    }).catch((error) => {
                        console.error('Error:', error)
                    })
            }

        } catch (error) {
            setError("Failed to add product.")
            console.error('Error:', error)
        }
    }

    const handleAddVariant = () => {
        setVariants((prev) => [...prev, { color: '', colorHex: '#000000', stock: '', price: '', images: [] }])
    }

    const handleRemoveVariant = (index) => {
        setVariants((prev) => prev.filter((_, i) => i !== index))
    }

    const handleCategoryChange = (value) => {
        const selectedCategoryData = categoryList.find(category => category._id === value)
        setSubCategories(selectedCategoryData ? selectedCategoryData.subcategories : [])
    }




    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{usedFor === "add" ? "Add New Product" : "Edit Product"}</DialogTitle>
                    <DialogDescription>
                        Fill in the details to {usedFor === "add" ? "add a new product" : "edit the product"}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="variants">Variants</TabsTrigger>
                            <TabsTrigger value="properties">Properties</TabsTrigger>
                            <TabsTrigger value="additional">Additional Info</TabsTrigger>
                        </TabsList>
                        <TabsContent value="details">
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="category">Category</Label>
                                            <Controller
                                                name="category"
                                                control={control}
                                                rules={{ required: 'Category is required' }}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={(value) => {
                                                            field.onChange(value);
                                                            handleCategoryChange(value);
                                                        }}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categoryList.map((category) => (
                                                                <SelectItem key={category._id} value={category._id}>
                                                                    {category.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="subCategory">Sub Category</Label>
                                            <Controller
                                                name="subCategory"
                                                control={control}
                                                rules={{ required: 'Sub Category is required' }}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger id="subCategory">
                                                            <SelectValue placeholder="Select a subcategory" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {subCategories.map((subCategory) => (
                                                                <SelectItem key={subCategory._id} value={subCategory._id}>
                                                                    {subCategory.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.subCategory && <p className="text-errorRed text-xs mt-1">{errors.subCategory.message}</p>}
                                        </div>

                                    </div>
                                    <div className="mt-4">
                                        <Label htmlFor="title">Title</Label>
                                        <Input {...register('title', { required: 'Title is required' })} />
                                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                                    </div>
                                    <div className="mt-4">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea {...register('description', { required: 'Description is required' })} rows={4} />
                                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="variants">
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-xl font-semibold mb-4">Product Variants</h3>
                                    <AnimatePresence>
                                        {variants.map((variant, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                                className="border p-4 rounded-md mt-4"
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="text-lg font-medium">Variant {variants[index].color}</h4>
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveVariant(index)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="grid gap-4">
                                                    <div className="flex w-full items-center space-x-2">
                                                        <div className=' w-full'>
                                                            <Label htmlFor={`variants.${index}.color`}>Color</Label>
                                                            <Input
                                                                {...register(`variants.${index}.color`, { required: 'Color is required' })}
                                                                value={variant.color}
                                                                onChange={(e) => {
                                                                    const newVariants = [...variants]
                                                                    newVariants[index].color = e.target.value
                                                                    setVariants(newVariants)
                                                                }}
                                                            />
                                                            {errors.variants && errors.variants[index]?.color && (
                                                                <span className="text-errorRed text-xs mt-1">{errors.variants[index].color.message}</span>
                                                            )}
                                                        </div>
                                                        <div className=' w-full'>
                                                            <Label htmlFor={`variants.${index}.colorHex`}>Color Hex</Label>
                                                            <Input
                                                                {...register(`variants.${index}.colorHex`, { required: 'Hexadecimal Color is required' })}
                                                                type="color"
                                                                value={variant.colorHex}
                                                                onChange={(e) => {
                                                                    const newVariants = [...variants]
                                                                    newVariants[index].colorHex = e.target.value
                                                                    setVariants(newVariants)
                                                                }}
                                                                className="p-0 rounded-md cursor-pointer"
                                                            />
                                                            {errors.variants && errors.variants[index]?.colorHex && (
                                                                <span className="text-errorRed text-xs mt-1">{errors.variants[index].colorHex.message}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`variants.${index}.stock`}>Stock</Label>
                                                        <Input
                                                            type="number"
                                                            {...register(`variants.${index}.stock`, {
                                                                required: 'Stock is required',
                                                                min: { value: 0, message: 'Stock must be a positive number' },
                                                            })}
                                                            value={variant.stock}
                                                            onChange={(e) => {
                                                                const newVariants = [...variants]
                                                                newVariants[index].stock = e.target.value
                                                                setVariants(newVariants)
                                                            }}
                                                        />
                                                        {errors.variants && errors.variants[index]?.stock && (
                                                            <span className="text-errorRed text-xs mt-1">{errors.variants[index].stock.message}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`variants.${index}.price`}>Price</Label>
                                                        <Input
                                                            type="number"
                                                            {...register(`variants.${index}.price`, {
                                                                required: 'Price is required',
                                                                min: { value: 0, message: 'Price must be a positive number' },
                                                            })}
                                                            value={variant.price}
                                                            onChange={(e) => {
                                                                const newVariants = [...variants]
                                                                newVariants[index].price = e.target.value
                                                                setVariants(newVariants)
                                                            }}
                                                        />
                                                        {errors.variants && errors.variants[index]?.price && (
                                                            <span className="text-errorRed text-xs mt-1">{errors.variants[index].price.message}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* {
                                                        cropper &&
                                                        <ImageCrop index={index} handleAddImageToVariant={handleAddImageToVariant} />
                                                    } */}
                                                <div className="mt-4">
                                                    <Label>Images</Label>
                                                    <ImageCrop variant={variant} setVariants={setVariants} index={index} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    <Button type="button" onClick={handleAddVariant} className="mt-4 bg-green_600">
                                        <Plus className="mr-2 h-4 w-4" /> Add Variant
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="properties">
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-xl font-semibold mb-4">Product Properties</h3>
                                    {watch('itemProperties', [{}]).map((property, index) => (
                                        <div key={index} className="flex gap-4 mt-4">
                                            <div className="flex-1">
                                                <Label htmlFor={`itemProperties.${index}.field`}>Field</Label>
                                                <Input
                                                    {...register(`itemProperties.${index}.field`, { required: 'Field is required' })}
                                                    placeholder="e.g., Height"
                                                />
                                                {errors.itemProperties && errors.itemProperties[index]?.field && (
                                                    <span className="text-errorRed text-xs mt-1">{errors.itemProperties[index].field.message}</span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <Label htmlFor={`itemProperties.${index}.value`}>Value</Label>
                                                <Input
                                                    {...register(`itemProperties.${index}.value`, { required: 'Value is required' })}
                                                    placeholder="e.g., 100 CM"
                                                />
                                                {errors.itemProperties && errors.itemProperties[index]?.value && (
                                                    <span className="text-errorRed text-xs mt-1">{errors.itemProperties[index].value.message}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            const currentProperties = watch('itemProperties') || []
                                            setValue('itemProperties', [...currentProperties, { field: '', value: '' }])
                                        }}
                                        className="mt-4 bg-green_600"
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Add Property
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="additional">
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="deliveryCondition">Delivery Condition</Label>
                                            <Controller
                                                name="deliveryCondition"
                                                control={control}
                                                rules={{ required: 'Delivery condition is required' }}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a delivery condition" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Assembled">Assembled</SelectItem>
                                                            <SelectItem value="Non-Assembled">Non-Assembled</SelectItem>
                                                            <SelectItem value="Installation by Service Partner">Installation by Service Partner</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.deliveryCondition && <p className="text-errorRed text-xs mt-1">{errors.deliveryCondition.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="warranty">Warranty Information</Label>
                                            <Textarea {...register('warranty', { required: 'Warranty information is required' })} rows={2} />
                                            {errors.warranty && <p className="text-errorRed text-xs mt-1">{errors.warranty.message}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="relatedKeywords">Related Keywords</Label>
                                            <Input {...register('relatedKeywords', { required: 'Keywords are required' })} />
                                            {errors.relatedKeywords && <p className="text-errorRed text-xs mt-1">{errors.relatedKeywords.message}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={onClose} className="text-green_600">
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-green_600">
                            {usedFor === "add" ? "Add Product" : "Update Product"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ProductModalForm