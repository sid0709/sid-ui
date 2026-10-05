import { DocsChrome } from "@/components/DocsChrome";
import { Providers } from "@/components/Providers";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "sid-ui",
  description: "React components, tokens, and theme used by Joined products.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>
        <Providers>
          <DocsChrome>{children}</DocsChrome>
        </Providers>
      </body>
    </html>
  );
}
