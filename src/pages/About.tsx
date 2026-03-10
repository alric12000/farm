import React from 'react';
import { motion } from 'motion/react';
import { Target, Heart, Award } from 'lucide-react';

export function About() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <section className="bg-farm-green-dark py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1592844002373-a55ebec8c227?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">Our Story</h1>
          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            A legacy rooted in quality agriculture, bringing the finest produce from the hills of Dang to your table.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-farm-accent font-semibold tracking-wider uppercase text-sm mb-4 block">The Beginning</span>
              <h2 className="text-4xl font-serif font-bold text-farm-green-dark mb-6 leading-tight">
                Cultivating Excellence Since Inception
              </h2>
              <div className="w-20 h-1 bg-farm-accent rounded-full mb-8"></div>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  We started Ghordaura Krishi Farm in the hills of Ghorahi with one goal:
                </p>
                To see if we could grow world-class avocados right here in Dang. What began as a small experiment with a few trees has grown into a full-scale farm. We don't use shortcuts; we focus on sustainable methods that keep the soil healthy so we can keep farming this land for years to come. For us, it’s pretty simple we grow fruit that tastes better because it’s grown right.


              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-farm-green rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070&auto=format&fit=crop"
                alt="Farm Landscape"
                className="rounded-2xl shadow-xl w-full h-[500px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-farm-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-serif font-bold text-farm-green-dark mb-4">Our Core Values</h2>
            <div className="w-24 h-1 bg-farm-accent mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 text-lg">
              The principles that guide our daily operations and long-term vision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <Target className="w-10 h-10 text-farm-accent" />,
                title: "Sustainability",
                description: "We employ eco-friendly farming techniques that conserve water, enrich the soil, and protect local biodiversity."
              },
              {
                icon: <Heart className="w-10 h-10 text-farm-accent" />,
                title: "Community",
                description: "We believe in empowering local farmers through employment, education, and fair trade practices."
              },
              {
                icon: <Award className="w-10 h-10 text-farm-accent" />,
                title: "Quality First",
                description: "From seed to harvest, we maintain rigorous quality control to ensure only the best produce reaches our customers."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-6 bg-farm-sand w-20 h-20 rounded-full flex items-center justify-center">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold text-farm-green-dark mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Founder */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-farm-accent font-semibold tracking-wider uppercase text-sm mb-4 block">
              The Person Behind It All
            </span>
            <h2 className="text-4xl font-serif font-bold text-farm-green-dark mb-4">
              Meet Our Founder
            </h2>
            <div className="w-24 h-1 bg-farm-accent mx-auto rounded-full" />
          </div>

          {/* Founder Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-farm-sand rounded-3xl shadow-lg overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Photo Column */}
              <div className="relative md:col-span-1">
                <img
                  src="/founder.jpg"
                  alt="Rajesh Sharma - Founder"
                  className="w-full h-72 md:h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-farm-green-dark/60 to-transparent md:bg-gradient-to-r" />
                <div className="absolute bottom-4 left-4 md:hidden">
                  <p className="text-white text-2xl font-serif font-bold">Gajraj Adhikari</p>
                  <p className="text-farm-accent text-sm font-semibold tracking-wide uppercase">Founder & CEO</p>
                </div>
              </div>

              {/* Info Column */}
              <div className="md:col-span-2 p-10 flex flex-col justify-center">
                <div className="hidden md:block mb-6">
                  <h3 className="text-3xl font-serif font-bold text-farm-green-dark">Gajraj Adhikari</h3>
                  <p className="text-farm-accent font-semibold tracking-wide uppercase text-sm mt-1">Founder & CEO</p>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Gajraj Adhikari didn't just move back to Nepal; he came back with a mission. After years of living in the USA, he made the life-changing decision to let go of his Green Card and return to his roots in Dang. Having traveled the world and seen global agricultural innovations firsthand, he knew the hills of Ghorahi had untapped potential.

                  Gajraj founded Ghordaura Krishi Farm as a creative revolution blending the international knowledge he gained abroad with a deep respect for local soil. For him, this isn’t just a farm; it’s a bold initiative to prove that with the right vision, we can grow world-class produce right here at home.
                </p>

              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
