'use client';

import { useEffect, useRef } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BitcoinButton from '@/components/landingpage/BitcoinButton';
import gsap from 'gsap';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const coinsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const star1Ref = useRef<HTMLImageElement>(null);
  const star2Ref = useRef<HTMLImageElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);

  // GSAP entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([sparkleRef.current, headlineRef.current, subheadlineRef.current, ctaRef.current, statsRef.current], {
        opacity: 0,
        y: 20,
      });
      gsap.set(coinsRef.current, {
        opacity: 0,
        x: 40,
        scale: 0.95,
      });
      gsap.set(glowRef.current, {
        opacity: 0,
        scale: 0.8,
      });
      gsap.set([star1Ref.current, star2Ref.current], {
        opacity: 0,
        scale: 0.5,
      });

      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(glowRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
      })
      .to(coinsRef.current, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.1,
        ease: 'power3.out',
      }, '-=0.8')
      .to([star1Ref.current, star2Ref.current], {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)',
      }, '-=0.6')
      .to(sparkleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.4')
      .to(headlineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.5')
      .to(subheadlineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.5')
      .to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.4')
      .to(statsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.3');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center overflow-hidden pt-20"
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Radial Glow Behind Coins */}
      <div
        ref={glowRef}
        className="absolute right-[5vw] top-[15vh] w-[50vw] h-[50vw] glow-violet-soft rounded-full blur-3xl opacity-50"
      />

      {/* Decorative Stars from reference image */}
      <div ref={sparkleRef} className="absolute left-[8vw] top-[14vh] z-20">
        <Sparkles className="w-10 h-10 text-white opacity-80" />
      </div>

      <img
        ref={star1Ref}
        src="/images/star.png"
        alt=""
        className="absolute left-[15vw] top-[25vh] w-6 h-6 object-contain star-twinkle z-10 opacity-40"
      />
      <img
        ref={star2Ref}
        src="/images/star.png"
        alt=""
        className="absolute right-[15vw] bottom-[35vh] w-8 h-8 object-contain star-twinkle z-10 opacity-60"
        style={{ animationDelay: '1.5s' }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl lg:max-w-[52vw]">
            {/* Simple Eyebrow Capsule */}
            <div className="inline-flex items-center px-5 py-2 bg-[#14151C] border border-white/10 rounded-full mb-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                OnnXcore Platform
              </span>
            </div>

            {/* Headline with Serif Italic Gradient */}
            <h1
              ref={headlineRef}
              className="font-sans font-bold text-5xl sm:text-6xl lg:text-5xl xl:text-7xl text-white leading-[1.05] tracking-tight mb-8"
            >
              Structured USDT <br />
              Trading <br />
              for Consistent <br />
              <span className="font-serif italic font-medium bg-gradient-to-r from-[#3872f0] to-[#F7931A] bg-clip-text text-transparent block mt-3">Daily Earnings</span>
            </h1>

            {/* Subheadline - light gray and leading */}
            <p
              ref={subheadlineRef}
              className="text-white/40 text-base lg:text-lg leading-relaxed mb-12 max-w-lg"
            >
              Access a controlled P2P trading environment with verified
              counterparties, fast settlements, and built-in risk management.
            </p>

            {/* CTAs - Matches reference borders and style */}
            <div ref={ctaRef} className="flex flex-wrap gap-6 mb-20">
              <BitcoinButton
                showArrow
                className="px-10 py-7 text-base border-white/30 shadow-glow hover:shadow-glow-lg transition-all"
              >
                Become a Vendor
              </BitcoinButton>
              <Button
                variant="outline"
                className="bg-transparent hover:bg-white/5 text-white border-white/10 rounded-full px-10 py-7 text-base font-semibold transition-all flex items-center gap-3"
              >
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
                View Platform
              </Button>
            </div>

            {/* Static Stats line from Design */}
            <div
              ref={statsRef}
              className="flex items-center gap-2"
            >
              <span className="text-white font-bold text-xl lg:text-2xl tracking-tight">$500K+</span>
              <span className="text-white/30 text-sm font-medium">Total Volume</span>
            </div>
          </div>

          {/* Right Content - 3D Coins with sparkle highlights */}
          <div
            ref={coinsRef}
            className="flex-1 flex justify-center lg:justify-end relative"
          >
            <div className="relative w-[70vw] max-w-[480px] lg:w-[34vw] lg:max-w-none">
              <img
                src="/images/crypto-coins.png"
                alt="3D Cryptocurrency Coins"
                className="w-full h-auto object-contain float-slow relative z-10 drop-shadow-[0_0_50px_rgba(56,114,240,0.15)]"
              />
              {/* Extra sparkle elements around coins to match design */}
              <div className="absolute top-1/4 -right-10 animate-twinkle opacity-60">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute bottom-1/4 -left-12 animate-twinkle opacity-40" style={{ animationDelay: '1s' }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="absolute top-1/2 -right-8 animate-twinkle opacity-30" style={{ animationDelay: '2s' }}>
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#03040C] to-transparent pointer-events-none" />
    </section>
  );
}