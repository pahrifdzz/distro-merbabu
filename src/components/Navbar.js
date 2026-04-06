import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <span className="text-xl font-bold">Distro Merbabu</span>
      <div className="flex gap-6 text-gray-500 text-sm">
        <Link href="/" className="hover:text-black">
          Produk
        </Link>
        <Link href="/tentang" className="hover:text-black">
          Tentang
        </Link>
      </div>
    </nav>
  );
}
