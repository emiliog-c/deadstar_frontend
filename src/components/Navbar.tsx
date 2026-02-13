'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FaShoppingCart } from "react-icons/fa";
import { CiInstagram } from "react-icons/ci";



export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="w-full bg-black text-white sticky top-0 z-50">
      <div className="container-mobile max-w-7xl mx-auto">
        <div className="flex items-center h-16 justify-start md:justify-between">
          {/* Desktop Left */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-xl md:text-2xl font-bold tracking-wide">
              d_eadstar
            </Link>
            {/* <div className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-widest text-slate-300">
                Products
              </span>
              <select
                className="bg-slate-800 border border-slate-700 text-sm rounded px-3 py-1.5"
                aria-label="Product categories"
              >
                <option>All</option>
                <option>New Arrivals</option>
                <option>Apparel</option>
                <option>Accessories</option>
              </select>
            </div> */}
          </div>

          {/* Mobile Layout */}
          <div className="flex md:hidden items-center w-full">
            <button
              className="text-sm font-semibold"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Toggle category menu"
              aria-expanded={isMenuOpen}
            >
              Menu
            </button>
            <div className="flex-1 flex justify-center">
              <Link href="/" className="text-xl font-bold tracking-wide">
                d_eadstar
              </Link>
            </div>
            <div className="flex items-center gap-3">
              {/* <button className="text-sm font-medium">Search</button> */}
              <Link href="/cart" className="text-sm font-medium flex items-center gap-1">
                <FaShoppingCart size={24} />
              </Link>
            </div>
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            {/* <button className="text-sm font-medium">Search</button> */}
            {/* <button className="text-sm font-medium">Account</button> */}
            <Link href="/cart" className="text-sm font-medium flex items-center gap-1">
              <FaShoppingCart size={36} />
            </Link>
            <Link href="https://www.instagram.com/d_eadstar/" target="_blank" rel="noreferrer" className="text-sm font-medium flex items-center gap-1">
              <CiInstagram size={36} /> 
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Popout Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close category menu"
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-slate-900 text-white p-6 flex flex-col">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Products
              </div>
              <button
                className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Close
              </button>
              <select
                className="mt-3 w-full bg-slate-800 border border-slate-700 text-sm rounded px-3 py-2"
                aria-label="Choose category"
              >
                <option>All</option>
                <option>New Arrivals</option>
                <option>Apparel</option>
                <option>Accessories</option>
              </select>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              {/* <button className="text-sm font-medium">Account</button> */}
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
