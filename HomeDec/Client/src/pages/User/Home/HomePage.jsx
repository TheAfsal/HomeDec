import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import HeroImage from '../../../assets/Images/hero.webp';
import ExperienceBanner from '../../../assets/Images/expImage.jpg';
import Met1 from '../../../assets/Images/Met1.jpg';
import Met2 from '../../../assets/Images/Met2.jpg';
import Met3 from '../../../assets/Images/Met3.jpg';
import { WhyChooseUs } from './NewHome';

const HomePage = () => {

    return (
        <div className="flex flex-col min-h-screen font-nunito">
            {/* Main Content */}
            <div className="flex-grow">
                {/* Hero Section */}
                <section className="bg-cover bg-bottom h-screen" style={{ backgroundImage: `url(${HeroImage})` }}>
                    <div className="flex items-center justify-center h-full bg-gray-800 bg-opacity-40">
                        <div className="text-center text-white">
                            <h1 className="text-5xl font-bold mb-4">
                                Make Your Interior More <br /> Minimalistic & Modern
                            </h1>
                            <p className="text-xl mb-8">
                                Turn your room with HomeDec into a lot more minimalist <br /> and modern with ease and speed
                            </p>
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-full">Shop Now</button>
                        </div>
                    </div>
                </section>

                {/* WhyChooseUs */}
                <WhyChooseUs />

                {/* Experience Banner */}
                <section className="flex flex-col lg:flex-row items-center justify-center lg:justify-between p-10 bg-white">
                    <div className="relative">
                        <img
                            src={ExperienceBanner}
                            alt="Interior design"
                            className="rounded-lg shadow-lg w-full lg:w-[500px] object-cover"
                        />
                    </div>

                    {/* Right Section - Text */}
                    <div className="lg:ml-10 text-center lg:text-left mt-10 lg:mt-0">
                        <h2 className="text-3xl font-bold text-gray-800">
                            We Provide You The <br /> Best Experience
                        </h2>
                        <p className="text-gray-500 mt-5">
                            You don’t have to worry about the result because all of these interiors
                            are made by people who are professionals in their fields with an elegant
                            and luxurious style and with premium quality materials.
                        </p>
                        <a href="#more-info" className="text-orange-500 flex items-center mt-5">
                            More Info
                            <span className="ml-2 text-xl">→</span>
                        </a>
                    </div>
                </section>


                <div className="bg-white py-16">
                    <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between">

                        <div className="md:w-1/2">
                            <h3 className="text-yellow-600 font-semibold tracking-widest uppercase text-sm">Materials</h3>
                            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                                Very Serious Materials For Making Furniture
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Because Panto was very serious about designing furniture for our environment, using a very expensive and famous capital but at a relatively low price.
                            </p>
                            <a href="#" className="text-yellow-600 font-medium flex items-center space-x-2">
                                <span>More Info</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>

                        {/* Images Section */}
                        <div className="md:w-1/2 grid grid-cols-2 gap-4 mt-8 md:mt-0">
                            <img src={Met1} alt="Furniture 1" className="rounded-lg shadow-md" />
                            <img src={Met2} alt="Furniture 2" className="rounded-lg shadow-md" />
                            <img src={Met3} alt="Furniture 3" className="rounded-lg shadow-md col-span-2" />
                        </div>

                    </div>
                </div>

                {/* Featured Categories */}
                <section className="py-12">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-semibold text-center mb-8">Featured Categories</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-4 rounded-lg shadow-lg">
                                <img src={HeroImage} alt="Chairs" className="w-full h-48 object-cover rounded-lg" />
                                <h3 className="text-xl mt-4 font-medium">Chairs</h3>
                                <p className="text-gray-600">Comfortable and stylish seating for every room.</p>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-lg">
                                <img src={HeroImage} alt="Chairs" className="w-full h-48 object-cover rounded-lg" />
                                <h3 className="text-xl mt-4 font-medium">Chairs</h3>
                                <p className="text-gray-600">Comfortable and stylish seating for every room.</p>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-lg">
                                <img src={HeroImage} alt="Chairs" className="w-full h-48 object-cover rounded-lg" />
                                <h3 className="text-xl mt-4 font-medium">Chairs</h3>
                                <p className="text-gray-600">Comfortable and stylish seating for every room.</p>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-lg">
                                <img src={HeroImage} alt="Chairs" className="w-full h-48 object-cover rounded-lg" />
                                <h3 className="text-xl mt-4 font-medium">Chairs</h3>
                                <p className="text-gray-600">Comfortable and stylish seating for every room.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Latest Products */}
                <section className="py-12 bg-gray-200">
                    <div className="container mx-auto">
                        <h2 className="text-3xl font-semibold text-center mb-8">Latest Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-4 rounded-lg shadow-lg">
                                <img src={HeroImage} alt="Product 1" className="w-full h-48 object-cover rounded-lg" />
                                <h3 className="text-xl mt-4 font-medium">Wooden Dining Chair</h3>
                                <p className="text-gray-600">$120</p>
                                <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </div>
    );
};

export default HomePage;



