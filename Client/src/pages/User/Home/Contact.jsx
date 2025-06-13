import { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import ExperienceBanner from '../../../assets/Images/expImage.jpg';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
    };

    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="container mx-auto max-w-6xl text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We'd love to hear from you. Whether you have a question about our products,
                        services, or anything else, our team is ready to answer all your questions.
                    </p>
                </div>
            </section>

            {/* Contact Information */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-500 mb-6">
                                <MapPin className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Our Location</h3>
                            <p className="text-gray-600">
                                Manjeri<br />
                                Malappuram District<br />
                                Kerala, PIN 676122
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-500 mb-6">
                                <Phone className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Phone Number</h3>
                            <p className="text-gray-600">
                                Customer Service:<br />
                                +91 9895914090<br />
                                Mon-Fri: 9am - 6pm
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-500 mb-6">
                                <Mail className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Email Address</h3>
                            <p className="text-gray-600">
                                General Inquiries:<br />
                                developer.afsal@gmail.com<br />
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Send Us A Message</h2>
                            <p className="text-gray-600 mb-8">
                                Fill out the form below and our team will get back to you as soon as possible.
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-amber-500 text-white font-medium rounded-md hover:bg-amber-600 transition-colors"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                        <div className="rounded-lg overflow-hidden">
                            <img
                                src={ExperienceBanner}
                                alt="Our showroom"
                                className="w-full h-auto object-cover rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Contact;