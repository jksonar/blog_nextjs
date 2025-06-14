'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header role="navigation" className="sticky top-0 z-10 w-full bg-dark text-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white">
            <span className="flex-shrink-0 text-primary-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="currentColor">
                <path d="M36 18.01c0 8.097-5.355 14.949-12.705 17.2a18.12 18.12 0 0 1-5.315.79C9.622 36 2.608 30.313.573 22.611.257 21.407.059 20.162 0 18.879v-1.758c.02-.395.059-.79.099-1.185.099-.908.277-1.817.514-2.686C2.687 5.628 9.682 0 18 0c5.572 0 10.551 2.528 13.871 6.517 1.502 1.797 2.648 3.91 3.359 6.201.494 1.659.771 3.436.771 5.292z" />
                <g fill="#fff">
                  <path d="M17.466 21.624c-.514 0-.988-.316-1.146-.829-.198-.632.138-1.303.771-1.501l7.666-2.469-1.205-8.254-13.317 4.621a1.19 1.19 0 0 1-1.521-.75 1.19 1.19 0 0 1 .751-1.521l13.89-4.818c.553-.197 1.166-.138 1.64.158a1.82 1.82 0 0 1 .85 1.284l1.344 9.183c.138.987-.494 1.994-1.482 2.33l-7.864 2.528-.375.04zm7.31.138c-.178-.632-.85-1.007-1.482-.81l-5.177 1.58c-2.331.79-3.28.02-3.418-.099l-6.56-8.412a4.25 4.25 0 0 0-4.406-1.758l-3.122.987c-.237.889-.415 1.777-.514 2.686l4.228-1.363a1.84 1.84 0 0 1 1.857.81l6.659 8.551c.751.948 2.015 1.323 3.359 1.323.909 0 1.857-.178 2.687-.474l5.078-1.54c.632-.178 1.008-.829.81-1.481z" />
                </g>
              </svg>
            </span>
            <span>ModernBlog</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`font-medium transition duration-150 ${isActive('/') ? 'text-primary-400' : 'text-white/80 hover:text-white'}`}
            >
              Home
            </Link>
            <Link 
              href="/blog" 
              className={`font-medium transition duration-150 ${isActive('/blog') ? 'text-primary-400' : 'text-white/80 hover:text-white'}`}
            >
              Blog
            </Link>
            <Link 
              href="/about" 
              className={`font-medium transition duration-150 ${isActive('/about') ? 'text-primary-400' : 'text-white/80 hover:text-white'}`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium transition duration-150 ${isActive('/contact') ? 'text-primary-400' : 'text-white/80 hover:text-white'}`}
            >
              Contact
            </Link>
          </nav>

          {/* Search and Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <button 
              type="button" 
              className="text-white/80 hover:text-white transition duration-150"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              type="button" 
              className="md:hidden text-white/80 hover:text-white transition duration-150"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className={`font-medium transition duration-150 ${isActive('/') ? 'text-primary-400' : 'text-white/80 hover:text-white'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/blog" 
                className={`font-medium transition duration-150 ${isActive('/blog') ? 'text-primary-400' : 'text-white/80 hover:text-white'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/about" 
                className={`font-medium transition duration-150 ${isActive('/about') ? 'text-primary-400' : 'text-white/80 hover:text-white'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className={`font-medium transition duration-150 ${isActive('/contact') ? 'text-primary-400' : 'text-white/80 hover:text-white'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;