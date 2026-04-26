"use client";
import { useState, useEffect, useCallback } from "react";
import { UserProfile } from "@/lib/types";
import { defaultProfile, getProfile, saveProfile } from "@/lib/storage";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    setLoaded(true);
  }, []);

  const update = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      saveProfile(next);
      return next;
    });
  }, []);

  return { profile, update, loaded };
}
