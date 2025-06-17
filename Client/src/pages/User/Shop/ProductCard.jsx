import useProgressiveImg from '@/hooks/useProgressive.hook'
import OfferPriceDisplay from '@/utils/calculateOfferPrice.jsx'

const ProductCard = ({ product }) => {

    const generateLQIPUrl = (originalUrl, size) => {
        const urlParts = originalUrl.split('/image/upload/')
        const baseUrl = urlParts[0] + '/image/upload/'
        const imagePublicId = urlParts[1].split('.')[0]
        return `${baseUrl}e_blur:30,q_70,f_auto,w_${size},h_${size}/${imagePublicId}.jpg`
    }

    let image = ""
    if (typeof product?.image === "object") {
        image = product?.image?.secure_url
    } else if (typeof product?.image === "string") {
        image = product?.image
    } else {
        image = ""
    }
    console.log(image);


    const [src, { blur }] = useProgressiveImg(generateLQIPUrl(image, 200), image);

    return (
        <div className="relative bg-gray-50 break-words mb-7">
            {product?.price >= product?.bestOffer?.minPurchaseAmount && (
                <span className="absolute top-2 left-2 flex items-center justify-center min-w-10 text-white bg-count_orange_background px-2 py-1 text-xs rounded-md h-5">
                    {product?.bestOffer?.discountType === 'percentage' ? (
                        `-${product?.bestOffer?.discountValue}%`
                    ) : (
                        `- ₹${product?.bestOffer?.discountValue}`
                    )}
                </span>
            )}

            <img
                src={src}
                alt="Product Image"
                className={`h-72 w-72 object-cover mb-4 transition-all duration-300 ${blur ? 'filter blur-[5px]' : 'filter-none'}`}
                loading="lazy"
            />

            <div className="flex flex-col justify-between h-32">
                <h3 className="text-lg font-extrabold text-gray-900">{product?.title}</h3>
                <p className="text-gray-400 font-medium text-sm max-w-64 line-clamp-2">
                    {product?.description}
                </p>
                <OfferPriceDisplay productPrice={product?.price} offerDetails={product?.bestOffer} />
            </div>
        </div>
    )
}


export default ProductCard
