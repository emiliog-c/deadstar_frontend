'use client'

import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-mobile max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-bold text-black">DEADSTAR</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <a href="#" className="text-sm font-medium hover:text-gray-600 transition">
              Shop
            </a>
            <a href="#collections" className="text-sm font-medium hover:text-gray-600 transition">
              Collections
            </a>
            <a href="#" className="text-sm font-medium hover:text-gray-600 transition">
              About
            </a>
            <a href="#" className="text-sm font-medium hover:text-gray-600 transition">
              Contact
            </a>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:text-gray-600 transition">
              Cart (0)
            </button>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`h-0.5 w-full bg-black transition-all ${
                    isMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-black transition-all ${isMenuOpen ? 'opacity-0' : ''}`}
                />
                <span
                  className={`h-0.5 w-full bg-black transition-all ${
                    isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <a href="#" className="block py-2 text-sm font-medium hover:text-gray-600">
              Shop
            </a>
            <a href="#collections" className="block py-2 text-sm font-medium hover:text-gray-600">
              Collections
            </a>
            <a href="#" className="block py-2 text-sm font-medium hover:text-gray-600">
              About
            </a>
            <a href="#" className="block py-2 text-sm font-medium hover:text-gray-600">
              Contact
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
