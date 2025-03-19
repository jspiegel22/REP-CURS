import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(name: string): string {
  // Convert the name to lowercase and trim spaces
  // Replace any non-alphanumeric characters (including &) with hyphens
  // Remove consecutive hyphens
  // Remove leading and trailing hyphens
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function generateVillaSlug(villaName: string): string {
  // Add "villa-" prefix and convert to slug format
  return `villa-${generateSlug(villaName.replace(/^Villa\s+/i, ''))}`;
}

export function generateResortSlug(resortName: string): string {
  // Generate a URL-friendly slug for resort names
  return generateSlug(resortName
    .replace(/Resort\s*(&|and)\s*Spa/i, '')
    .replace(/Hotel/i, '')
    .trim()
  );
}