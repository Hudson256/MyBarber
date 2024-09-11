import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Footer from "./_components/footer";
import AuthProvider from "./_providers/auth";
import "@/app/_lib/logger";
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
    title: "My Barber",
    description: "Agende seu corte de cabelo ou barba com os melhores profissionais",
};
export default function RootLayout({ children, }) {
    return (<html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex h-full flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>);
}
