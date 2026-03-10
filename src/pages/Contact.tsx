import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-farm-sand">
      {/* Header */}
      <section className="bg-farm-green-dark py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=2042&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">हामीसँग सम्पर्क राख्नुहोस्</h1>
          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Get in touch with us for fresh produce, wholesale inquiries, or to visit our farm in Dang.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div>
                <span className="text-farm-accent font-semibold tracking-wider uppercase text-sm mb-4 block">Reach Out</span>
                <h2 className="text-4xl font-serif font-bold text-farm-green-dark mb-6 leading-tight">
                  We'd Love to Hear From You
                </h2>
                <div className="w-20 h-1 bg-farm-accent rounded-full mb-8"></div>
                <p className="text-gray-600 text-lg leading-relaxed mb-10">
                  Whether you have a question about our products, want to place an order, or are interested in visiting the farm, our team is ready to assist you.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                    <MapPin className="w-6 h-6 text-farm-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-farm-green-dark mb-2">Visit Our Farm</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Ghordaura, Ghorahi Sub-Metropolitan City-19<br />
                      Dang, Lumbini Province, Nepal
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                    <Phone className="w-6 h-6 text-farm-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-farm-green-dark mb-2">Call Us</h3>
                    <p className="text-gray-600 leading-relaxed">
                      <a href="tel:+9779857833000" className="hover:text-farm-green transition-colors">+977 9857833000</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                    <Mail className="w-6 h-6 text-farm-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-farm-green-dark mb-2">Email Us</h3>
                    <p className="text-gray-600 leading-relaxed">
                      <a href="mailto:info@ghordaurafarm.com" className="hover:text-farm-green transition-colors">info@ghordaurafarm.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                    <Clock className="w-6 h-6 text-farm-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-farm-green-dark mb-2">Business Hours</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Sunday - Friday: 8:00 AM - 5:00 PM<br />
                      Saturday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-farm-green opacity-5 rounded-bl-full"></div>
              <h3 className="text-2xl font-serif font-bold text-farm-green-dark mb-8 relative z-10">Send a Message</h3>

              <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                    placeholder="+977 98XXXXXXXX"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-farm-green text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-farm-green-light transition-colors duration-300 shadow-md flex items-center justify-center gap-2 group"
                >
                  Send Message
                  <Send className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-96 bg-gray-200 relative">
        <iframe
          src="https://maps.google.com/maps?q=Ghordaura+Krishi+Farm,+Ghorahi,+Dang,+Nepal&t=&z=15&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ghordaura Krishi Farm Location"
          className="absolute inset-0 w-full h-full"
        />
      </section>
    </div>
  );
}
