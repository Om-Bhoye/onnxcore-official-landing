'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#' },
    { label: 'About', href: '#about' },
    { label: 'Execution', href: '#execution' },
    { label: 'Security', href: '#security' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'glass border-b border-white/10 py-3 shadow-glow'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">

          {/* Logo — large like OnnXpay reference with lighting effect */}
          <div className="flex items-center flex-shrink-0 relative">
            {/* Stronger lighting effect behind logo */}
            <div className="absolute -inset-x-10 inset-y-0 bg-[#3872f0]/40 blur-[45px] rounded-full pointer-events-none opacity-70" />
            <div className="absolute inset-y-0 inset-x-0 -inset-x-6 bg-white/10 blur-[20px] rounded-full pointer-events-none opacity-40" />
            <img
              src="/images/logo.png"
              alt="OnnXcore"
              className="relative z-10 h-10 lg:h-12 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.35)]"
            />
          </div>

          {/* Desktop Center Navigation — plain links, no container */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 transition-all duration-300 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Side — Contact Us CTA */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <a
              href="#contact"
              className="relative group px-7 py-3 rounded-full text-xs font-bold uppercase tracking-[0.14em] text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet via-blue-500 to-violet transition-all duration-500 group-hover:bg-[size:200%_auto] group-hover:bg-right" />
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/30 blur-[4px] rounded-full" />
              <span className="relative z-10 flex items-center gap-2">
                Contact Us
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white/70 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass rounded-2xl mt-4 p-4 border border-white/10 shadow-xl overflow-hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-3 rounded-xl text-base font-medium text-white/70 hover:text-white transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="border-t border-gray-100 pt-4 mt-2">
                <a
                  href="#contact"
                  className="bg-violet text-white w-full text-center py-3 rounded-xl font-semibold block hover:brightness-110 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Us →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}