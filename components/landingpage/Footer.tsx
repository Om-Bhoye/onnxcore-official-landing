'use client';

import { useEffect, useRef } from 'react';
import { Send, Code, Globe, MessageCircle } from 'lucide-react';
import Link from 'next/link';
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
const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
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
      className="relative w-full min-h-[calc(100vh-72px)] lg:min-h-0 flex flex-col pt-16 sm:pt-20 lg:pt-32 pb-8"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-cobalt-900" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet/50 to-transparent" />

      <div className="relative z-10 w-full flex-1 flex flex-col justify-between px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Top Content Wrapper */}
        <div className="flex flex-col">
          {/* CTA Section */}
          <div ref={ctaRef} className="text-center mb-12 sm:mb-16 lg:mb-24">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white mb-6">
              Start <span className="font-serif italic font-medium text-gradient">Trading with{' '}</span>
              <span className="font-serif italic font-medium text-gradient">Structure</span>
            </h2>
            <p className="text-cobalt-200 text-sm sm:text-base lg:text-lg max-w-xl mx-auto mb-8">
              Join a platform built for speed, safety, and consistent execution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <BitcoinButton
                  showArrow
                  className="px-10 py-4 h-14 sm:h-16 flex items-center justify-center min-w-[200px] text-base"
                >
                  Create Account
                </BitcoinButton>
              </Link>
              <button
                className="bg-transparent hover:bg-white/5 text-white border-2 border-white/20 rounded-full px-10 py-4 h-14 sm:h-16 flex items-center justify-center min-w-[200px] text-base font-medium transition-all duration-300 hover:scale-105"
              >
                Talk to Sales
              </button>
            </div>
          </div>

          {/* Links Section */}
          <div ref={linksRef} className="border-t border-white/10 pt-10 sm:pt-12 lg:pt-16">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-y-12 gap-x-4 md:gap-12 mb-10 sm:mb-12">
              {/* Logo Column */}
              <div className="col-span-3 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0">
                <div className="flex items-center relative mb-6 w-max mx-auto md:mx-0">
                  <div className="absolute inset-y-0 -inset-x-4 sm:-inset-x-8 bg-[#3872f0]/60 blur-[20px] sm:blur-[30px] rounded-[100%] pointer-events-none" />
                  <img
                    src="/images/logo.png"
                    alt="OnnXcore"
                    className="relative z-10 h-8 sm:h-13 lg:h-15 w-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                  />
                </div>
                <p className="text-cobalt-200 text-[11px] sm:text-sm leading-relaxed max-w-[280px] sm:max-w-xs md:max-w-none">
                  Structured USDT trading for consistent <br /> 
                  <span className="font-serif italic font-medium text-gradient">daily earnings.</span>
                </p>
              </div>

              {/* Link Columns */}
              {Object.entries(footerLinks).map(([key, section]) => (
                <div key={key} className="text-center md:text-left">
                  <h4 className="font-heading font-semibold text-white text-[11px] sm:text-sm uppercase tracking-wider mb-4">
                    {section.title}
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {section.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-cobalt-200 text-xs sm:text-sm transition-all duration-300 hover:bg-[linear-gradient(135deg,#3872f0_0%,#F7931A_100%)] hover:bg-clip-text hover:text-transparent"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar — Pushed to very bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 pt-8 pb-4 border-t border-white/10 text-center sm:text-left">
          <p className="text-cobalt-200 text-[10px] sm:text-xs">
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
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 flex items-center justify-center text-cobalt-200 hover:text-white hover:bg-[linear-gradient(135deg,#3872f0_0%,#F7931A_100%)] hover:shadow-[0_0_15px_rgba(56,114,240,0.4)] transition-all duration-300"
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}