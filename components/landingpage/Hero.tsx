'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import BitcoinButton from '@/components/landingpage/BitcoinButton';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

// Two stat groups that cycle
const statCycles = [
  [
    { value: '$500K+', label: 'Total Volume' },
    { value: '$100K+', label: 'Daily Flow' },
  ],
  [
    { value: '85%', label: 'Completion' },
    { value: '<2%', label: 'Dispute' },
  ],
];

// Duration each cycle stays visible (in ms)
const CYCLE_DURATION = 3000;

// Smooth cubic-bezier easing
const smoothEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const coinsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const star1Ref = useRef<HTMLImageElement>(null);
  const star2Ref = useRef<HTMLImageElement>(null);

  // Controls when stat cycling begins (after GSAP finishes)
  const [statsReady, setStatsReady] = useState(false);
  // Which cycle is currently active (0 or 1)
  const [activeCycle, setActiveCycle] = useState(0);

  // Authentication State
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Fetch User Auth
  useEffect(() => {
    fetch('/api/user/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setUser(data);
        setAuthLoading(false);
      })
      .catch(() => setAuthLoading(false));
  }, []);

  // GSAP entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([headlineRef.current, subheadlineRef.current, ctaRef.current], {
        opacity: 0,
        y: 24,
      });
      gsap.set(coinsRef.current, {
        opacity: 0,
        x: 60,
        scale: 0.92,
      });
      gsap.set(glowRef.current, {
        opacity: 0,
        scale: 0.9,
      });
      gsap.set([star1Ref.current, star2Ref.current], {
        opacity: 0,
        scale: 0.7,
        rotation: -90,
      });

      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(star1Ref.current, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.7,
        ease: 'back.out(1.6)',
      })
        .to(
          star2Ref.current,
          {
            opacity: 0.6,
            scale: 1,
            rotation: 0,
            duration: 0.7,
            ease: 'back.out(1.6)',
          },
          '-=0.5'
        )
        .to(
          glowRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 1.1,
            ease: 'power3.out',
          },
          '-=0.6'
        )
        .to(
          coinsRef.current,
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.9'
        )
        .to(
          headlineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.7'
        )
        .to(
          subheadlineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            onComplete: () => setStatsReady(true),
          },
          '-=0.4'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cycle loop: switch between stat groups every CYCLE_DURATION
  useEffect(() => {
    if (!statsReady) return;
    const interval = setInterval(() => {
      setActiveCycle((prev) => (prev + 1) % statCycles.length);
    }, CYCLE_DURATION);
    return () => clearInterval(interval);
  }, [statsReady]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center overflow-hidden pt-24 lg:pt-0"
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Radial Glow Behind Coins */}
      <div
        ref={glowRef}
        className="absolute right-[5vw] top-[15vh] w-[45vw] h-[45vw] glow-violet-soft rounded-full blur-3xl"
      />

      {/* Decorative Stars */}
      <img
        ref={star1Ref}
        src="/images/star.png"
        alt=""
        className="absolute left-[6vw] top-[18vh] w-10 h-10 md:w-11 md:h-11 object-contain star-twinkle z-10"
      />
      <img
        ref={star2Ref}
        src="/images/star.png"
        alt=""
        className="absolute right-[15vw] bottom-[25vh] w-6 h-6 md:w-8 md:h-8 object-contain star-twinkle z-10"
        style={{ animationDelay: '1s' }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 pt-32 lg:pt-36 pb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          {/* Left Content */}
          <div className="flex-1 max-w-xl lg:max-w-2xl flex flex-col">
            {/* Eyebrow - Centered relative to headline on all screens */}
            <p className="self-center lg:self-center inline-flex items-center h-10 px-6 bg-white/5 border border-white/10 rounded-full mb-8 text-xs uppercase tracking-[0.14em] text-white/70 transition-all duration-300">
              OnnXcore Platform
            </p>

            {/* Headline */}
            <h1
              ref={headlineRef}
              className="font-sans font-bold text-4xl sm:text-4xl lg:text-5xl xl:text-6xl text-white leading-[1.1] tracking-tight mb-10 text-left flex flex-col gap-1 sm:gap-2"
            >
              <span className="whitespace-nowrap">Structured USDT Trading</span>
              <span className="whitespace-nowrap">Consistent Growth</span>
              <span className="whitespace-nowrap">
                <span className="font-serif italic font-medium text-gradient">Daily Earnings</span>
              </span>
            </h1>

            {/* Subheadline */}
            <p
              ref={subheadlineRef}
              className="text-cobalt-200 text-base lg:text-lg leading-relaxed mb-10 max-w-lg text-left"
            >
              Access a controlled P2P trading environment with verified
              counterparties, fast settlements, and built-in risk management.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-wrap gap-4 mb-10">
              {user ? (
                <Link href="/dashboard">
                  <BitcoinButton showArrow className="hover:scale-105">
                    Go to Dashboard
                  </BitcoinButton>
                </Link>
              ) : (
                <Link href="/signup">
                  <BitcoinButton showArrow className="hover:scale-105">
                    Become a Vendor
                  </BitcoinButton>
                </Link>
              )}
              <Button
                variant="outline"
                className="bg-transparent hover:bg-white/5 text-white border border-white/20 rounded-full px-6 lg:px-8 py-3 lg:py-6 text-sm lg:text-base font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                View Platform
              </Button>
            </div>

            {/* Trust Metrics — Cycling Carousel */}
            <div className="relative h-14 overflow-hidden">
              <AnimatePresence mode="wait">
                {statsReady && (
                  <motion.div
                    key={activeCycle}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.6,
                      ease: smoothEase,
                    }}
                    className="absolute inset-0 flex items-center gap-6 lg:gap-8"
                  >
                    {statCycles[activeCycle].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.15,
                          ease: smoothEase,
                        }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-white font-heading font-bold text-lg lg:text-xl">
                          {stat.value}
                        </span>
                        <span className="text-cobalt-200 text-xs lg:text-sm">
                          {stat.label}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Content - Crypto Coins */}
          <div
            ref={coinsRef}
            className="flex-1 flex justify-center lg:justify-end relative"
          >
            <div className="relative w-[55vw] max-w-[380px] lg:w-[26vw] lg:max-w-none">
              <img
                src="/images/crypto-coins.png"
                alt="3D Cryptocurrency Coins"
                className="w-full h-auto object-contain float-slow"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#03040C] to-transparent pointer-events-none" />
    </section>
  );
}