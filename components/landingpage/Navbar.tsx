'use client';

import { useState, useEffect } from 'react';
import { Menu, X, UserCircle, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface User {
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Fetch user status
    fetch('/api/user/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Execution', href: '/#execution' },
    { label: 'Security', href: '/#security' },
    ...(user ? [{ label: 'Contact Us', href: '/contact' }] : []),
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-3'
        : 'bg-white py-4'
        }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">

          {/* Logo — Responsive size */}
          <div className="flex items-center flex-shrink min-w-0">
            <Image
              src="/images/logo.png"
              alt="OnnXcore"
              width={180}
              height={48}
              className="h-8 sm:h-10 lg:h-12 w-auto object-contain"
              priority
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

          {/* Right Side — CTA or Profile */}
          <div className="hidden md:flex items-center flex-shrink-0 gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 transition-all hover:bg-gray-100"
                >
                  <UserCircle className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700 capitalize">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/contact"
                className="bg-violet text-white px-7 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:brightness-110 hover:shadow-glow flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
              >
                Contact Us
                <span>→</span>
              </Link>
            )}
          </div>

          {/* Mobile Layout: Contact Us (if not logged in) + Menu Button */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            {!user && (
              <Link
                href="/contact"
                className="bg-violet text-white px-2.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold hover:brightness-110 active:scale-95 transition-all whitespace-nowrap max-w-[110px] truncate"
              >
                Contact Us
              </Link>
            )}
            <button
              className="text-gray-600 p-1.5"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
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
                {user && (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center justify-center gap-2 bg-gray-50 text-gray-700 w-full py-3 rounded-xl font-semibold transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 bg-red-50 text-red-500 w-full py-3 rounded-xl font-semibold transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}