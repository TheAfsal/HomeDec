import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ListAllProducts } from '@/api/administrator/productManagement'
import { USER_ROUTES } from '@/config/routerConstants'
import { useInfiniteQuery } from '@tanstack/react-query'
import { generateSkeletons } from '@/utils/generateSkeletons'
const ProductCard = React.lazy(() => import('./ProductCard'));


const ProductList = ({ searchProducts,searchedText }) => {

    const { data,
        error,
        status,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['products'],
        queryFn: ListAllProducts,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        suspense: true,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 60,
    })

    const bottomRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            {
                rootMargin: '100px',
            }
        );

        if (bottomRef.current) {
            observer.observe(bottomRef.current);
        }

        return () => {
            if (bottomRef.current) {
                observer.unobserve(bottomRef.current);
            }
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (status === 'error') {
        return (
            <div>
                <h2>Error</h2>
                <p>{error?.message || 'An error occurred while fetching products.'}</p>
            </div>
        );
    }

    console.log(data);
    


    return (
        <div className='w-full'>
            <div className='flex flex-wrap justify-center gap-8'>
                {
                    !searchProducts.length && searchedText === "" ?
                        data?.pages.map((group) => (
                            group.products.map((product) => (
                                <React.Fragment key={product._id}>
                                    <Link to={`/${USER_ROUTES.SHOP}/${product._id}`}>
                                        <ProductCard product={product} />
                                    </Link>
                                </React.Fragment>
                            ))
                        )):(
                            searchProducts.map((product) => (
                                <React.Fragment key={product._id}>
                                    <Link to={`/${USER_ROUTES.SHOP}/${product._id}`}>
                                        <ProductCard product={product} />
                                    </Link>
                                </React.Fragment>
                            ))
                        )
                    }
            </div>

            {/* Pagination and Loading Button */}
            <div className="w-full flex justify-center mt-8">
                {isFetchingNextPage &&
                    (
                        <div className=' flex flex-wrap justify-center gap-8'>
                            {generateSkeletons(9)}
                        </div>
                    )
                }
            </div>
            <div ref={bottomRef} className="h-2" />
        </div>
    )
}

export default ProductList

