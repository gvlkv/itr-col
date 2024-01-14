import "~/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "~/app/_components/nav-bar";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { ToastContainer } from "react-toastify";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export const metadata = {
  title: "itr-col",
  description: "Manage your collectables and explore that of others",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <div className="flex flex-col">
            <NavBar />
            {children}
          </div>
          <ToastContainer />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
