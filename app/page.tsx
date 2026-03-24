'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/landingpage/Navbar';
import Hero from '@/components/landingpage/Hero';
import Features from '@/components/landingpage/Features';
import Process from '@/components/landingpage/Process';
import Safety from '@/components/landingpage/Safety';
import Footer from '@/components/landingpage/Footer';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
    });

    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative">
        <Hero />
        <Features />
        <Process />
        <Safety />
        <Footer />
      </main>
    </div>
  );
}

export default App;