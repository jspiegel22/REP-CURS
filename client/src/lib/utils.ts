import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(name: string): string {
  // Convert the name to lowercase
  // Replace any non-alphanumeric characters with hyphens
  // Remove leading and trailing hyphens
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function generateVillaSlug(villaName: string): string {
  // Add "villa-" prefix and convert to slug format
  return `villa-${generateSlug(villaName.replace(/^Villa\s+/i, ''))}`;
}