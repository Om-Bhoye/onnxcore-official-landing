'use client';

import { useEffect, useRef } from 'react';
import { Send, Code, Globe, MessageCircle } from 'lucide-react';
import BitcoinButton from '@/components/landingpage/BitcoinButton';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  product: {
    title: 'Product',
    links: ['Features', 'Pricing', 'API', 'Affiliates'],
  },
  support: {
    title: 'Support',
    links: ['Help Center', 'Contact', 'Status'],
  },
  legal: {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Cookies'],
  },
};

const socialLinks = [
  { icon: Send, href: '#', label: 'Twitter' },
  { icon: Code, href: '#', label: 'GitHub' },
  { icon: Globe, href: '#', label: 'LinkedIn' },
  { icon: MessageCircle, href: '#', label: 'Discord' },
];

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // CTA animation
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Links animation
      gsap.fromTo(
        linksRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: linksRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="relative w-full pt-20 lg:pt-32 pb-8"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-cobalt-900" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet/50 to-transparent" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* CTA Section */}
        <div ref={ctaRef} className="text-center mb-16 lg:mb-24">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white mb-6">
            Start <span className="font-serif italic font-medium text-gradient">Trading with{' '}</span>
            <span className="font-serif italic font-medium text-gradient">Structure</span>
          </h2>
          <p className="text-cobalt-200 text-base lg:text-lg max-w-xl mx-auto mb-8">
            Join a platform built for speed, safety, and consistent execution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <BitcoinButton 
              showArrow 
              className="px-8 py-6 text-base"
            >
              Create Account
            </BitcoinButton>
            <button
              className="bg-transparent hover:bg-white/5 text-white border border-white/20 rounded-full px-8 py-6 text-base font-medium transition-all duration-300 hover:scale-105"
            >
              Talk to Sales
            </button>
          </div>
        </div>

        {/* Links Section */}
        <div ref={linksRef} className="border-t border-white/10 pt-12 lg:pt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Logo Column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center relative mb-6 w-max">
                <div className="absolute inset-y-0 -inset-x-8 bg-[#3872f0]/60 blur-[30px] rounded-[100%] pointer-events-none" />
                <img 
                  src="/images/logo.png" 
                  alt="OnnXcore" 
                  className="relative z-10 h-16 lg:h-15 w-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                />
              </div>
              <p className="text-cobalt-200 text-sm leading-relaxed">
                Structured USDT trading for consistent daily earnings.
              </p>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-cobalt-200 hover:text-white text-sm transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
            <p className="text-cobalt-200 text-xs">
              © 2026 OnnXcore. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-cobalt-200 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}