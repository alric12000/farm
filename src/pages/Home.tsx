import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Truck, ArrowRight, Star, Phone } from 'lucide-react';
import { motion } from 'motion/react';

export function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=2575&auto=format&fit=crop"
            alt="Avocado Farm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-farm-green-dark/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-farm-accent/20 text-farm-accent border border-farm-accent/30 text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
              100% Organic & Fresh
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Fresh Avocados from the Hills of Dang
            </h1>
            <p className="text-xl text-gray-200 mb-10 leading-relaxed font-light drop-shadow-md">
              Experience the rich, creamy taste of sustainably grown avocados, cultivated with care in the pristine environment of Ghordaura Krishi Farm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/products"
                className="bg-farm-accent text-farm-green-dark px-8 py-4 rounded-full font-semibold text-lg hover:bg-white transition-colors duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Explore Products
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-colors duration-300 w-full sm:w-auto"
              >
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-serif font-bold text-farm-green-dark mb-4">Why Choose Our Farm?</h2>
            <div className="w-24 h-1 bg-farm-accent mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 text-lg">
              We are committed to sustainable farming practices, ensuring that every fruit we produce is not only delicious but also environmentally responsible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Leaf className="w-8 h-8 text-farm-accent" />,
                title: "100% Organic",
                description: "Grown without synthetic pesticides or fertilizers, ensuring pure, natural goodness in every bite."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-farm-accent" />,
                title: "Premium Quality",
                description: "Hand-picked at peak ripeness and rigorously inspected to meet our high standards of excellence."
              },
              {
                icon: <Truck className="w-8 h-8 text-farm-accent" />,
                title: "Farm to Table",
                description: "Delivered fresh from our orchards directly to your local markets, minimizing transit time."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="bg-farm-sand rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300 border border-farm-green/5"
              >
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-serif font-bold text-farm-green-dark mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Product Section */}
      <section className="py-24 bg-farm-green-dark text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-farm-green opacity-50 transform skew-x-12 translate-x-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                src="https://images.unsplash.com/photo-1601039641847-7857b994d704?q=80&w=2070&auto=format&fit=crop"
                alt="Fresh Hass Avocado"
                className="rounded-2xl shadow-2xl border-4 border-white/10"
              />
            </div>
            <div className="lg:w-1/2 space-y-8">
              <div>
                <span className="text-farm-accent font-semibold tracking-wider uppercase text-sm">Signature Yield</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 mb-6">The Perfect Hass Avocado</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Known for its pebbly skin that turns purplish-black when ripe, our Hass avocados offer a rich, nutty flavor and a creamy, buttery texture that melts in your mouth.
                </p>
                <ul className="space-y-4">
                  {[
                    "High in healthy monounsaturated fats",
                    "Rich source of vitamins C, E, K, and B-6",
                    "Perfect for guacamole, salads, or toast",
                    "Sustainably grown in nutrient-rich soil"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-farm-accent/20 flex items-center justify-center shrink-0">
                        <Star className="w-3.5 h-3.5 text-farm-accent fill-farm-accent" />
                      </div>
                      <span className="text-gray-200">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-farm-accent text-farm-green-dark px-8 py-4 rounded-full font-semibold hover:bg-white transition-colors duration-300"
              >
                View All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-farm-sand">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold text-farm-green-dark mb-6">Ready to Taste the Difference?</h2>
          <p className="text-xl text-gray-600 mb-10">
            Visit our farm or contact us to place an order for the freshest avocados in the region.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-farm-green text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-farm-green-light transition-colors duration-300 shadow-md"
            >
              Contact Us Now
            </Link>
            <a
              href="tel:+9779857833000"
              className="bg-white text-farm-green-dark border-2 border-farm-green px-8 py-4 rounded-full font-semibold text-lg hover:bg-farm-green/5 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call +977 9857833000
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
