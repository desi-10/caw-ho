"use client";

import { useEffect, useState } from "react";
import { registerServiceWorker } from "@/lib/register-sw";
import Image from "next/image";

export default function PWARegister() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Check if this is the first load or PWA launch
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const hasSeenSplash = sessionStorage.getItem("splash-shown");

    if (isStandalone && !hasSeenSplash) {
      setShowSplash(true);
      sessionStorage.setItem("splash-shown", "true");

      // Hide splash screen after 2 seconds
      setTimeout(() => {
        setShowSplash(false);
      }, 2000);
    }

    // Register service worker
    registerServiceWorker();
  }, []);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-primary via-primary to-primary/90 animate-fadeIn">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_50%)]" />

      {/* Logo container */}
      <div className="relative z-10 flex flex-col items-center gap-6 animate-scaleIn">
        {/* Logo with glow effect */}
        <div className="relative">
          {/* Glow background */}
          <div className="absolute inset-0 bg-white/30 rounded-full blur-3xl scale-150 animate-pulse" />

          {/* Logo */}
          <div className="relative w-32 h-32 rounded-3xl bg-white shadow-2xl p-6 animate-float">
            <Image
              src="/logo.png"
              alt="Christ Assembly Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* App name */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            Christ Assembly
          </h1>
          <p className="text-white/90 text-sm font-medium">Worldwide - Ho</p>
        </div>

        {/* Loading indicator */}
        <div className="flex gap-2 mt-4">
          <div
            className="w-2 h-2 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
