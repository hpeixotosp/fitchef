// Corrige import circular em useProfile.ts — o defaultProfile vem de storage.ts
export { defaultProfile, getProfile, saveProfile } from "@/lib/storage";
export type { UserProfile } from "@/lib/types";
