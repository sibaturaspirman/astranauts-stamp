import Image from 'next/image';
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // sesuai kebutuhan
});

export const metadata = {
  title: 'Astranauts 2025',
  description: 'Let’s Explore Astranauts 2025',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <main className="min-h-screen max-w-md mx-auto bg-custom flex flex-col items-center justify-centerx">
          <div className="w-full max-w-sm flex flex-col items-center mt-5 mb-5 pointer-events-none">
            <Image
              src="/images/logo.png"
              alt="astra"
              className="w-[70%]"
              width={343}
              height={40}
            />
          </div>
          
          {children}

          <a href="https://zirolu.id/" target="_blank" className="block fixed bottom-0 w-full max-w-sm flex flex-col items-center pointer-events-nonex">
            <Image
              src="/images/powered.png"
              alt="astra"
              className="w-[80%]"
              width={276}
              height={36}
            />
          </a>
        </main>
      </body>
    </html>
  );
}
