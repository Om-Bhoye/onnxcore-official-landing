'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

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
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Execution', href: '/#execution' },
    { label: 'Security', href: '/#security' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-3'
        : 'bg-white py-4'
        }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">

          {/* Logo — large like OnnXpay reference */}
          <div className="flex items-center flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="OnnXcore"
              className="h-10 lg:h-12 w-auto"
            />
          </div>

          {/* Desktop Center Navigation — plain links, no container */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-600 transition-all duration-300 hover:bg-[linear-gradient(135deg,#3872f0_0%,#F7931A_100%)] hover:bg-clip-text hover:text-transparent"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Side — Contact Us CTA */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <Link
              href="/contact"
              className="bg-violet text-white px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:brightness-110 hover:shadow-glow flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              Contact Us
              <span>→</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 p-2"
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
          <div className="md:hidden bg-white/95 backdrop-blur-md rounded-2xl mt-4 p-4 border border-gray-100 shadow-xl overflow-hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-[linear-gradient(135deg,#3872f0_0%,#F7931A_100%)] hover:bg-clip-text hover:text-transparent transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="border-t border-gray-100 pt-4 mt-2">
                <Link
                  href="/contact"
                  className="bg-violet text-white w-full text-center py-3 rounded-xl font-semibold block hover:brightness-110 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Us →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}