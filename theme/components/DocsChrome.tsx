"use client";

import { AppShell, BrandHeading, Button, TopNav, TopNavItem } from "sid-ui";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { CatalogNav } from "@/components/CatalogNav";
import { ClientOnly } from "@/components/ClientOnly";
import { useColorMode } from "@/components/Providers";

function pagePath(path: string) {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export function DocsChrome({ children }: { children: ReactNode }) {
  const path = pagePath(usePathname() ?? "/");
  const { mode, setMode } = useColorMode();

  return (
    <AppShell
      variant="elevated"
      contentPadding={6}
      topNav={
        <TopNav
          label="Documentation"
          heading={<BrandHeading headingHref="/" />}
          startContent={
            <>
              <TopNavItem
                label="Components"
                href="/"
                isSelected={path === "/" || path.startsWith("/components")}
              />
              <TopNavItem label="Tokens" href="/tokens" isSelected={path === "/tokens"} />
            </>
          }
          endContent={
            <Button
              label={mode === "dark" ? "Light" : "Dark"}
              variant="ghost"
              onClick={() => setMode(mode === "dark" ? "light" : "dark")}
            />
          }
        />
      }
      sideNav={
        <ClientOnly>
          <CatalogNav path={path} />
        </ClientOnly>
      }
    >
      {children}
    </AppShell>
  );
}
