import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export function Products() {
  const products = [
    {
      id: 1,
      name: "Hass Avocado",
      description: "Creamy, buttery texture with a rich, nutty flavor. Perfect for guacamole or toast.",
      image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=2575&auto=format&fit=crop",
      category: "Avocados",
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Fuerte Avocado",
      description: "Smooth, green skin with a slightly milder flavor and lower oil content.",
      image: "https://images.unsplash.com/photo-1601039641847-7857b994d704?q=80&w=2070&auto=format&fit=crop",
      category: "Avocados"
    },
    {
      id: 3,
      name: "Guava",
      description: "Sweet, fragrant guavas with soft pink flesh, rich in vitamin C and dietary fiber. Freshly picked from our orchards.",
      image: "/Guava.png",
      category: "Fruits",
      badge: "Seasonal"
    },
    {
      id: 4,
      name: "Seedling Plants",
      description: "Start your own orchard with our healthy, grafted avocado and fruit tree seedlings.",
      image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070&auto=format&fit=crop",
      category: "Nursery"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-farm-sand">
      {/* Header */}
      <section className="bg-farm-green-dark py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=2042&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">Our Farm Yield</h1>
          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Discover the diverse range of premium, sustainably grown produce from Ghordaura Krishi Farm.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <div className="absolute top-4 right-4 bg-farm-accent text-farm-green-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {product.badge}
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-farm-green-dark text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {product.category}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-serif font-bold text-farm-green-dark mb-3">{product.name}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6 line-clamp-2">{product.description}</p>
                  <a
                    href="tel:+9779857833000"
                    className="inline-flex items-center gap-2 text-farm-green font-semibold hover:text-farm-green-light transition-colors group/link"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Order Now
                    <ArrowRight className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wholesale CTA */}
      <section className="py-24 bg-farm-green text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">Interested in Wholesale?</h2>
          <p className="text-xl text-gray-200 mb-10 leading-relaxed">
            We supply premium avocados and exotic fruits to restaurants, hotels, and retailers across the region. Contact us for bulk pricing and delivery options.
          </p>
          <a
            href="mailto:wholesale@ghordaurafarm.com"
            className="inline-flex items-center gap-2 bg-farm-accent text-farm-green-dark px-8 py-4 rounded-full font-semibold text-lg hover:bg-white transition-colors duration-300 shadow-lg"
          >
            Contact Wholesale Team
          </a>
        </div>
      </section>
    </div>
  );
}
