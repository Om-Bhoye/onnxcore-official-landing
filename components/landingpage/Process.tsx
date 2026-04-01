'use client';

import { useEffect, useRef } from 'react';
import { UserCheck, Shield, FileText, Coins } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    icon: UserCheck,
    title: 'Register',
    description: 'Create your account and choose your role: vendor, trader, or affiliate.',
  },
  {
    number: '02',
    icon: Shield,
    title: 'KYC',
    description: 'Verify identity to unlock limits and access protected features.',
  },
  {
    number: '03',
    icon: FileText,
    title: 'Publish Offers',
    description: 'Set your pricing, volume, and settlement methods.',
  },
  {
    number: '04',
    icon: Coins,
    title: 'Execute & Capture Margin',
    description: 'Trade with verified counterparties and manage risk in real time.',
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<SVGPathElement>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  // Autoplay for mobile slider
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMobileIndex((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
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

      // Connecting line animation
      if (lineRef.current) {
        const pathLength = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Steps animation with stagger
      stepsRef.current.forEach((step, index) => {
        if (step) {
          gsap.fromTo(
            step,
            { opacity: 0, y: 50, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              delay: index * 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: step,
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
      id="execution"
      ref={sectionRef}
      className="relative w-full py-16 lg:py-32 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Section Header */}
        <div
          ref={titleRef}
          className="mb-12 lg:mb-20 text-center flex flex-col items-center"
        >
          <p className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-4 text-sm text-white/70">
            How It Works
          </p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white max-w-xl mx-auto">
            Simple Process.{" "}
            <span className="font-serif italic font-medium text-gradient">
              Controlled Execution.
            </span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connecting Line - Desktop Only */}
          <svg
            className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 hidden lg:block"
            viewBox="0 0 100 16"
            preserveAspectRatio="none"
          >
            <path
              ref={lineRef}
              d="M 0 8 Q 25 0, 50 8 T 100 8"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3872F0" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#3872F0" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3872F0" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

          {/* Desktop & Tablet Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <StepCard 
                key={index} 
                step={step} 
                index={index} 
                isActive={false}
                setRef={(el) => { stepsRef.current[index] = el; }} 
              />
            ))}
          </div>

          {/* Mobile Sideways Slider */}
          <div className="block md:hidden">
            <div className="relative h-[480px] w-full max-w-[340px] mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMobileIndex}
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <StepCard 
                    step={steps[activeMobileIndex]} 
                    index={activeMobileIndex} 
                    isActive={true}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer Tagline */}
        <div className="mt-12 lg:mt-16 text-center">
          <p className="font-mono text-sm uppercase tracking-[0.14em] text-violet-light">
            Your pricing. Your volume. Your earnings.
          </p>
        </div>
      </div>
    </section>
  );
}

interface StepCardProps {
  step: typeof steps[0];
  index: number;
  isActive?: boolean;
  setRef?: (el: HTMLDivElement | null) => void;
}

function StepCard({ step, index, isActive, setRef }: StepCardProps) {
  const Icon = step.icon;
  return (
    <div
      ref={setRef}
      className={`group relative h-full ${isActive ? 'force-hover' : ''}`}
    >
      <div className="cyber-container noselect">
        <div className="cyber-canvas">
          {/* Trackers */}
          {[...Array(25)].map((_, i) => (
            <div key={i} className={`cyber-tracker tr-${i + 1}`} />
          ))}

          <div id="cyber-card" className={isActive ? 'active' : ''}>
            <div className="cyber-card-content">
              <div className="cyber-card-glare" />
              
              {/* Decorative Cyber Elements */}
              <div className="cyber-lines">
                <span /><span /><span /><span />
              </div>
              
              <div className="cyber-glowing-elements">
                <div className="cyber-glow cyber-glow-1" />
                <div className="cyber-glow cyber-glow-2" />
                <div className="cyber-glow cyber-glow-3" />
              </div>

              <div className="cyber-particles">
                {[...Array(6)].map((_, i) => <span key={i} />)}
              </div>

              <div className="cyber-corner-elements">
                <span /><span /><span /><span />
              </div>

              <div className="cyber-scan-line" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center h-full p-8 lg:p-10 pointer-events-auto">
                <div className={`text-violet font-mono text-[10px] md:text-sm font-bold mb-4 tracking-[0.2em] transform transition-transform duration-500 ${isActive ? 'translate-y-0' : 'translate-y-4 group-hover:translate-y-0'}`}>
                  STEP {step.number}
                </div>

                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(56,114,240,0.2)]">
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="font-heading font-bold text-xl md:text-2xl text-white mb-4 bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                  {step.title}
                </h3>

                <p className="text-cobalt-200 text-xs md:text-base leading-relaxed px-2">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}