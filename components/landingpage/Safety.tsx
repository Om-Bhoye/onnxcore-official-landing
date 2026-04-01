'use client';

import { useEffect, useRef } from 'react';
import { Shield, Scale, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const safetyFeatures = [
  {
    icon: Shield,
    title: 'Low Dispute Exposure',
    subtitle: '<2%',
    description: 'Our advanced verification and escrow system keeps dispute rates exceptionally low.',
    points: ['Verified KYC + behavior scoring', 'Escrow-backed every trade'],
    color: 'from-violet/20 to-violet/5',
  },
  {
    icon: Scale,
    title: 'Full Resolution System',
    subtitle: '24h',
    description: 'Structured mediation process with transparent on-chain proof for every transaction.',
    points: ['Structured mediation within 24h', 'Transparent on-chain proof'],
    color: 'from-orange/20 to-orange/5',
  },
];

export default function Safety() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [activeStatIndex, setActiveStatIndex] = useState(0);

  const stats = [
    { value: '99.9%', label: 'Uptime' },
    { value: '256-bit', label: 'Encryption' },
    { value: '2FA', label: 'Security' },
    { value: 'SOC 2', label: 'Compliant' },
  ];

  const statGroups = [
    [stats[0], stats[1]],
    [stats[2], stats[3]],
  ];

  // Autoplay for mobile sliders
  useEffect(() => {
    const featureInterval = setInterval(() => {
      setActiveMobileIndex((prev) => (prev + 1) % safetyFeatures.length);
    }, 4000);

    const statInterval = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % statGroups.length);
    }, 3500);

    return () => {
      clearInterval(featureInterval);
      clearInterval(statInterval);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, x: index === 0 ? -60 : 60 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              delay: index * 0.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
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
      id="security"
      ref={sectionRef}
      className="relative w-full py-16 lg:py-32"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Glow Effects */}
      <div className="absolute left-0 top-1/4 w-96 h-96 bg-violet/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-orange/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Section Header */}
        <div ref={titleRef} className="mb-12 lg:mb-16 text-center flex flex-col items-center">
          <p className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-4 text-sm text-white/70">
            Safety First
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white max-w-xl mx-auto">
            <span className="font-serif italic font-medium text-gradient">
              Security & Risk Controls
            </span>
          </h2>
        </div>

        {/* Safety Cards Content */}
        <div className="relative">
          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-6 lg:gap-8">
            {safetyFeatures.map((feature, index) => (
              <SafetyCard 
                key={index} 
                feature={feature} 
                index={index} 
                setRef={(el) => { cardsRef.current[index] = el; }} 
              />
            ))}
          </div>

          {/* Mobile Dual-Direction Slider */}
          <div className="block lg:hidden">
            <div className="relative h-[380px] w-full max-w-[340px] mx-auto overflow-visible">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMobileIndex}
                  initial={{ 
                    opacity: 0, 
                    x: activeMobileIndex === 0 ? -50 : 50,
                    scale: 0.95 
                  }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ 
                    opacity: 0, 
                    x: activeMobileIndex === 0 ? 50 : -50,
                    scale: 0.95 
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <SafetyCard 
                    feature={safetyFeatures[activeMobileIndex]} 
                    index={activeMobileIndex} 
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-12 lg:mt-16">
          {/* Desktop Stats Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} value={stat.value} label={stat.label} />
            ))}
          </div>

          {/* Mobile Animated Stats Slider */}
          <div className="block md:hidden">
            <div className="relative h-24">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStatIndex}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 grid grid-cols-2 gap-4"
                >
                  {statGroups[activeStatIndex].map((stat, idx) => (
                    <StatCard key={idx} value={stat.value} label={stat.label} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: string, label: string }) {
  return (
    <div className="neu-card text-center p-6 flex flex-col items-center justify-center content-center h-full">
      <div className="font-heading font-bold text-xl lg:text-3xl text-white mb-2">
        {value}
      </div>
      <div className="text-cobalt-200 text-[10px] lg:text-xs uppercase tracking-[0.2em] font-mono">
        {label}
      </div>
    </div>
  );
}

interface SafetyCardProps {
  feature: typeof safetyFeatures[0];
  index: number;
  setRef?: (el: HTMLDivElement | null) => void;
}

function SafetyCard({ feature, index, setRef }: SafetyCardProps) {
  const Icon = feature.icon;
  return (
    <div
      ref={setRef}
      className="safety-card safety-card-shadow h-full group"
    >
      <div className="relative p-7 md:p-10 backdrop-blur-sm h-full">
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg md:text-2xl text-white">
                  {feature.title}
                </h3>
              </div>
            </div>
            <span className="font-heading font-bold text-2xl md:text-4xl text-gradient">
              {feature.subtitle}
            </span>
          </div>

          {/* Description */}
          <p className="text-cobalt-200 text-sm md:text-base leading-relaxed mb-6">
            {feature.description}
          </p>

          {/* Points */}
          <ul className="space-y-3 mb-6">
            {feature.points.map((point, pointIndex) => (
              <li
                key={pointIndex}
                className="flex items-center gap-3 text-xs md:text-sm text-cobalt-100"
              >
                <div className="w-2 h-2 rounded-full bg-violet" />
                {point}
              </li>
            ))}
          </ul>

          {/* Learn More Link */}
          <button className="flex items-center gap-2 text-violet-light text-sm font-medium group/btn">
            Learn more
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}