import HeroImage from '../../../assets/Images/hero.webp';
import ExperienceBanner from '../../../assets/Images/expImage.jpg';

const About = () => {
    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                HomeDec was founded with a simple yet powerful vision: to transform living spaces into
                                minimalist and modern sanctuaries that reflect personal style and enhance daily living.
                            </p>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Since our establishment in 2024, we've been dedicated to crafting furniture that combines
                                aesthetic appeal with functional design, using premium materials that stand the test of time.
                            </p>
                        </div>
                        <div className="rounded-lg overflow-hidden">
                            <img
                                src={HeroImage}
                                alt="HomeDec showroom"
                                className="w-full h-auto object-cover rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">Quality Craftsmanship</h3>
                            <p className="text-gray-600">
                                We believe in creating furniture that lasts. Each piece is meticulously crafted
                                using premium materials and time-honored techniques.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">Sustainable Practices</h3>
                            <p className="text-gray-600">
                                Our commitment to the environment drives us to source materials responsibly and
                                implement eco-friendly manufacturing processes.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">Customer Satisfaction</h3>
                            <p className="text-gray-600">
                                Your happiness is our priority. We strive to exceed expectations with exceptional
                                products and unparalleled service.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Materials Section - Similar to your homepage */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-amber-500 uppercase font-medium mb-2">MATERIALS</h3>
                            <h2 className="text-4xl font-bold mb-6">Very Serious Materials For Making Furniture</h2>
                            <p className="text-gray-600 mb-8">
                                Because HomeDec is very serious about designing furniture for our environment, using very
                                expensive and famous capital but at a relatively low price.
                            </p>
                            <a href="/shop" className="text-amber-500 font-medium flex items-center">
                                More Info
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                        <div className="rounded-lg overflow-hidden">
                            <img
                                src={ExperienceBanner}
                                alt="Premium materials"
                                className="w-full h-auto object-cover rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;