import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "Distro Merbabu",
  description: "Website marketplace Distro Merbabu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={geist.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
