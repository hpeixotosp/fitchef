"use client";
import { useEffect, useCallback } from "react";

export function useWakeLock(enabled: boolean) {
  const requestWakeLock = useCallback(async () => {
    if (!enabled) return;
    try {
      if ("wakeLock" in navigator) {
        await (navigator as unknown as { wakeLock: { request: (type: string) => Promise<unknown> } }).wakeLock.request("screen");
      }
    } catch {
      // Graceful fallback — not all browsers support this
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) requestWakeLock();
  }, [enabled, requestWakeLock]);
}
