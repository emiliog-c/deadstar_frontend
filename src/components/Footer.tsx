'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-black text-white py-12 md:py-16">
      <div className="container-mobile max-w-7xl mx-auto">
        {/* Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 md:mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-4">DEADSTAR</h3>
            <p className="text-sm text-gray-400">
              Premium quality products for the modern lifestyle.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  All Products
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Sale
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 md:pt-12">
          {/* Social Links */}
          <div className="flex gap-6 mb-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition text-sm font-medium"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition text-sm font-medium"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition text-sm font-medium"
            >
              TikTok
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-500">
            © {currentYear} DeadStar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
