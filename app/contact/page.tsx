'use client';

import { useState } from 'react';
import Navbar from '@/components/landingpage/Navbar';
import Footer from '@/components/landingpage/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formState);
    alert('Thank you for contacting us! We will get back to you soon.');
  };

  return (
    <div className="relative min-h-screen bg-[#03040C] text-white overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#3872f0]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#F7931A]/5 blur-[120px] rounded-full pointer-events-none" />

      <Navbar />

      <main className="relative pt-32 pb-20 px-6 sm:px-8 lg:px-12 max-w-[1280px] mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 text-xs uppercase tracking-[0.14em] text-white/70">
              Get in Touch
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Contact <span className="font-serif italic font-medium text-gradient">Our Team</span>
            </h1>
            <p className="text-cobalt-200 text-lg max-w-2xl mx-auto">
              Have questions about OnnXcore? We're here to help you navigate the world of structured USDT trading.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-2xl font-bold border-b border-white/10 pb-4">Contact Information</h2>
              
              <div className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3872f0]/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-[#3872f0]/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#3872f0]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                  <p className="text-cobalt-200">support@onnxcore.com</p>
                  <p className="text-cobalt-200">partners@onnxcore.com</p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#F7931A]/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-[#F7931A]/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-[#F7931A]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">24/7 Support</h3>
                  <p className="text-cobalt-200">Live chat available for verified vendors</p>
                  <p className="text-cobalt-200">Telegram: @OnnXcoreSupport</p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Global Presence</h3>
                  <p className="text-cobalt-200">Operating across major USDT trading hubs</p>
                  <p className="text-cobalt-200">Registered Office: Singapore</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-[#3872f0]/10 to-transparent border border-white/10">
              <h3 className="text-xl font-bold mb-4">Why reach out?</h3>
              <ul className="space-y-3">
                {[
                  'Inquire about large volume institutional trading',
                  'Become a certified high-liquidity vendor',
                  'Technical integration with our P2P engine',
                  'Report security concerns or platform feedback'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-cobalt-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3872f0]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 md:p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden"
          >
            {/* Subtle glow effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3872f0]/20 blur-[50px] -z-10" />
            
            <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/60 mb-2 ml-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#3872f0]/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="John Doe"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-2 ml-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#3872f0]/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="john@example.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-white/60 mb-2 ml-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#3872f0]/50 focus:bg-white/10 transition-all duration-300"
                  placeholder="How can we help?"
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white/60 mb-2 ml-1">Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#3872f0]/50 focus:bg-white/10 transition-all duration-300 resize-none"
                  placeholder="Tell us more about your inquiry..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-primary text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(56,114,240,0.4)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
              >
                Send Message
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
