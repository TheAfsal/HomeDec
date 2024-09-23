import React from 'react'

const NewHome = () => {
    return (
        <div>
            <HeroSection />
            <WhyChooseUs />
            <BestSellingProducts />
        </div>
    )
}

export default NewHome

import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const products = [
    { name: "Sakarias Armchair", price: "$392", image: "/chair1.jpg" },
    { name: "Baltsar Chair", price: "$299", image: "/chair2.jpg" },
    { name: "Anjay Chair", price: "$519", image: "/chair3.jpg" },
    { name: "Nyantuy Chair", price: "$399", image: "/chair4.jpg" }
];

const BestSellingProducts = () => {
    const scrollLeft = () => {
        document.getElementById("product-carousel").scrollLeft -= 300;
    };

    const scrollRight = () => {
        document.getElementById("product-carousel").scrollLeft += 300;
    };

    return (
        <section className="py-16">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Best Selling Product</h2>
                <div className="relative">
                    <button onClick={scrollLeft} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full">
                        <MdChevronLeft size={30} />
                    </button>
                    <div
                        id="product-carousel"
                        className="flex space-x-4 overflow-x-auto scroll-smooth scrollbar-hide"
                    >
                        {products.map((product, index) => (
                            <div key={index} className="min-w-[200px] p-4 bg-white shadow-lg rounded-lg">
                                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-t-lg" />
                                <div className="mt-4">
                                    <h3 className="font-semibold">{product.name}</h3>
                                    <p className="text-gray-600">{product.price}</p>
                                    <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg">Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={scrollRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full">
                        <MdChevronRight size={30} />
                    </button>
                </div>
            </div>
        </section>
    );
};

const WhyChooseUs = () => {
    return (
        <section className="py-16 bg-gray-100">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Why Choosing Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold">Luxury Facilities</h3>
                        <p className="mt-4">
                            The advantage of having a workspace with style and superior materials.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Affordable Price</h3>
                        <p className="mt-4">
                            You can’t miss out on the stylish and modern furniture at great prices.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Many Choices</h3>
                        <p className="mt-4">
                            We offer a wide range of products suitable for any space in your home.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};


const HeroSection = () => {
  return (
    <section className="bg-cover bg-center h-screen text-white" style={{ backgroundImage: "url('/path-to-your-hero-image.jpg')" }}>
      <div className="h-full flex flex-col justify-center items-center text-center space-y-6">
        <h1 className="text-5xl font-bold">Make Your Interior More Minimalistic & Modern</h1>
        <p className="text-lg max-w-2xl">
          Turn your room with partito into a lot more minimalist and modern with ease and speed.
        </p>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search Furniture"
            className="py-2 px-4 rounded-lg text-black w-80"
          />
          <button className="bg-orange-500 hover:bg-orange-600 py-2 px-4 rounded-lg">Search</button>
        </div>
      </div>
    </section>
  );
};


