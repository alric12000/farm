import React from 'react';
import { motion } from 'motion/react';

export function Gallery() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=2575&auto=format&fit=crop",
      alt: "Avocado Farm",
      span: "col-span-1 md:col-span-2 row-span-2"
    },
    {
      src: "https://images.unsplash.com/photo-1601039641847-7857b994d704?q=80&w=2070&auto=format&fit=crop",
      alt: "Fresh Hass Avocado",
      span: "col-span-1 row-span-1"
    },
    {
      src: "/Guava.png",
      alt: "Guava",
      span: "col-span-1 row-span-1"
    },
    {
      src: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070&auto=format&fit=crop",
      alt: "Farm Landscape",
      span: "col-span-1 md:col-span-2 row-span-1"
    },
    {
      src: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070&auto=format&fit=crop",
      alt: "Seedling Plants",
      span: "col-span-1 md:col-span-3 row-span-2"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <section className="bg-farm-green-dark py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1592844002373-a55ebec8c227?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">Our Gallery</h1>
          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            A visual journey through our farm, showcasing the beauty of sustainable agriculture in the hills of Dang.
          </p>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative overflow-hidden rounded-2xl group ${image.span}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-serif text-xl font-medium tracking-wide drop-shadow-md">
                    {image.alt}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
