import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-16">
      <div style={{ background: '#111111' }} className="px-6 md:px-8 pt-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">

            {/* Brand */}
            <div>
              <div className="mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/merbabu.png"
                  alt="Distro Merbabu"
                  className="h-12 w-auto brightness-0 invert"
                />
              </div>
              <p style={{ color: '#999999' }} className="text-sm leading-relaxed mb-4">
                Toko pakaian distro berkualitas tinggi dengan desain stylish untuk aktivitas outdoor dan sehari-hari.
              </p>

              {/* Social media */}
              <div className="flex gap-3">

                {/* Instagram */}
                
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition overflow-hidden"
                  style={{
                    background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="5" fill="none"/>
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.8" fill="none"/>
                    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
                    <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
                  </svg>
                </a>

                {/* WhatsApp */}
                
                  href="https://wa.me/6208123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition"
                  style={{ background: '#25D366' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4C7.6 8 7 8.7 7 10.1c0 1.4 1 2.7 1.2 2.9.1.2 2 3.1 5 4.3.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.6.2-1.2.1-1.3-.1-.1-.3-.2-.6-.3z"
                      fill="white"
                    />
                    <path
                      d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.4 5.3L2 22l4.8-1.3C8.3 21.5 10.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.7 0-3.4-.5-4.8-1.3l-.3-.2-3 .8.8-2.9-.2-.3C3.5 15.3 3 13.7 3 12 3 7 7 3 12 3s9 4 9 9-4 9-9 9z"
                      fill="white"
                    />
                  </svg>
                </a>

                {/* TikTok */}
                
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition"
                  style={{ background: '#010101' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z"/>
                  </svg>
                </a>

              </div>
            </div>

            {/* Navigasi */}
            <div>
              <p style={{ color: '#666666' }} className="text-xs font-medium uppercase tracking-widest mb-4">Navigasi</p>
              <div className="flex flex-col gap-2.5">
                <Link href="/" style={{ color: '#cccccc' }} className="text-sm hover:text-white transition">Beranda</Link>
                <Link href="/produk" style={{ color: '#cccccc' }} className="text-sm hover:text-white transition">Semua Produk</Link>
                <Link href="/keranjang" style={{ color: '#cccccc' }} className="text-sm hover:text-white transition">Keranjang</Link>
              </div>
            </div>

            {/* Kontak */}
            <div>
              <p style={{ color: '#666666' }} className="text-xs font-medium uppercase tracking-widest mb-4">Kontak</p>
              <div className="flex flex-col gap-2.5">
                <span style={{ color: '#cccccc' }} className="text-sm">📍 Tangerang, Banten</span>
                <span style={{ color: '#cccccc' }} className="text-sm">📱 08123456789</span>
                <span style={{ color: '#cccccc' }} className="text-sm">✉️ distromerbabu@gmail.com</span>
                <span style={{ color: '#cccccc' }} className="text-sm">🕐 Senin - Sabtu, 09.00 - 21.00</span>
              </div>
            </div>

          </div>
        </div>

        {/* Gelombang */}
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="block w-full -mb-px">
          <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#000000"/>
        </svg>
      </div>

      {/* Bottom bar */}
      <div style={{ background: '#000000' }} className="px-6 md:px-8 py-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p style={{ color: '#555555' }} className="text-xs">
            © {new Date().getFullYear()} Distro Merbabu. All rights reserved.
          </p>
          <div className="flex gap-1.5">
            <span style={{ background: '#222222', color: '#888888' }} className="text-xs px-3 py-1 rounded-full">Next.js</span>
            <span style={{ background: '#222222', color: '#888888' }} className="text-xs px-3 py-1 rounded-full">Tailwind</span>
            <span style={{ background: '#222222', color: '#888888' }} className="text-xs px-3 py-1 rounded-full">Supabase</span>
          </div>
        </div>
      </div>

    </footer>
  )
}