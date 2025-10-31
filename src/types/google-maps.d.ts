// src/types/google-maps.d.ts
/// <reference types="google.maps" />

// Optional: define the script callback if your script URL has one
declare global {
  interface Window {
    initAutocomplete?: () => void;
  }
}
export {};
