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
        <main className="min-h-screen bg-custom flex flex-col items-center justify-centerx">
          <div className="w-full max-w-sm flex flex-col items-center mt-5 mb-5 pointer-events-none">
            <img src="/images/logo.png" alt="Astra Logo" className="w-[90%]" />
          </div>
          
          {children}

          <div className="fixed bottom-0 w-full max-w-sm flex flex-col items-center pointer-events-none">
            <img src="/images/powered.png" alt="Astra Logo" className="w-[80%]" />
          </div>
        </main>
      </body>
    </html>
  );
}
