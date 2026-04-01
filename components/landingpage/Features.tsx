'use client';

import { useEffect, useRef } from 'react';
import { TrendingUp, Zap, BarChart3 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: TrendingUp,
    title: 'Consistent Order Flow',
    description: 'Verified traders, high match rate with adjustable spreads and real-time availability.',
    points: ['Verified traders', 'High match rate', 'Real-time availability'],
  },
  {
    icon: Zap,
    title: 'Fast Execution',
    description: 'Sub-second matching with instant settlement notifications and auto-escrow release.',
    points: ['Sub-second matching', 'Instant notifications', 'Auto-escrow release'],
  },
  {
    icon: BarChart3,
    title: 'Scalable Earnings',
    description: 'Volume-based tiers with affiliate commissions and weekly payouts.',
    points: ['Volume-based tiers', 'Affiliate commissions', 'Weekly payouts'],
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  // Autoplay for mobile slider
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMobileIndex((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation with stagger
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 60, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              delay: index * 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full py-16 lg:py-32"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Section Header */}
        <div ref={titleRef} className="mb-12 lg:mb-16">
          <p className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-4 text-sm text-white/70">
            Why OnnXcore
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white">
            Built for <span className="font-serif italic font-medium text-gradient">Active Traders</span>
          </h2>
        </div>

        {/* Features Content */}
        <div className="relative">
          {/* Desktop & Tablet Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index} 
                feature={feature} 
                index={index} 
                setRef={(el) => { cardsRef.current[index] = el; }} 
              />
            ))}
          </div>

          {/* Mobile Slider */}
          <div className="block md:hidden">
            <div className="relative h-[420px] w-full max-w-[340px] mx-auto overflow-visible">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMobileIndex}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <FeatureCard 
                    feature={features[activeMobileIndex]} 
                    index={activeMobileIndex} 
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: typeof features[0];
  index: number;
  setRef?: (el: HTMLDivElement | null) => void;
}

function FeatureCard({ feature, index, setRef }: FeatureCardProps) {
  return (
    <div
      ref={setRef}
      className="feature-card h-full min-h-[380px] group flex flex-col justify-center"
    >
      {/* Background Icon (Ethereum-style SVG) */}
      <div className="feature-card-icon w-32 h-32 opacity-[0.08] lg:opacity-[0.1] pointer-events-none transition-all duration-500 group-hover:scale-110">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" version="1.1" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 784.37 1277.39">
          <g id="Layer_x0020_1">
            <g id="_1421394342400">
              <g>
                <polygon fill="#3872f0" fillRule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54" />
                <polygon fill="#F7931A" fillRule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33" />
                <polygon fill="#1425c2" fillRule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89" />
                <polygon fill="#F7931A" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89" />
                <polygon fill="#1425c2" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33" />
                <polygon fill="#3872f0" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33" />
              </g>
            </g>
          </g>
        </svg>
      </div>

      <div className="feature-card-content p-6 flex flex-col items-center">
        <h3 className="font-heading font-bold text-xl lg:text-2xl text-white mb-1">
          {feature.title}
        </h3>
        <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mb-4">
          OnnXcore Feature
        </span>
        
        <p className="text-white/80 font-medium text-sm lg:text-base leading-relaxed mb-6 px-2">
          {feature.description}
        </p>

        <ul className="space-y-2">
          {feature.points.map((point, pointIndex) => (
            <li
              key={pointIndex}
              className="flex items-center justify-center gap-2 text-xs text-cobalt-200"
            >
              <div className="w-1 h-1 rounded-full bg-violet" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}